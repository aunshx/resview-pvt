import * as d3 from "d3";
import { line } from "d3-shape";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ACTION_TYPE_PBFT_GRAPH, COLORS_PBFT_GRAPH, NUMBER_OF_STEPS_PBFT_GRAPH, TRANSDURATION_PBFT_GRAPH } from "../../../../../Constants";
import { GraphResizerContext } from "../../../../../Context/graph";
import { ThemeContext } from "../../../../../Context/theme";
import { cancelIcon, playIcon } from "../../../../../Resources/Icons";
import { IconButtons } from "../../../../Shared/Buttons";
import { Icon } from "../../../../Shared/Icon";
import { dummyData } from "../data";
import { connectionRender, labelPrimaryNode } from "./Computation/D3";
import { generateConnections, generateLabels, generateLines, generatePoints, generateTransactionIds } from "./Computation/Skeleton";


const PBFT = ({
    messageHistory,
    // TODO: Uncomment the below after connecting to the BE
    // transactionNumber 
}) => {
    const { boxValues, resizing, setResizing } = useContext(GraphResizerContext);
    const { width, height } = boxValues;
    const { theme } = useContext(ThemeContext);

    // TODO: Comment the below two lines after connecting to the BE
    const { transactionIds } = generateTransactionIds(dummyData);
    const [transactionNumber, setTransactionNumber] = useState(transactionIds[0]);
    const [graphHide, setGraphHide] = useState(false);

    const ref = useRef(null);

    const debouncedRender = useCallback(() => {
        const data = generatePoints(
            width,
            height,
            0,
            Math.floor(height / 4),
            4,
            NUMBER_OF_STEPS_PBFT_GRAPH
        );

        const { xCoords, yCoords, verticalLines, horizontalLines } = generateLines(
            data,
            NUMBER_OF_STEPS_PBFT_GRAPH
        );

        const { points, primaryIndex } = generateConnections(
            data,
            NUMBER_OF_STEPS_PBFT_GRAPH,
            xCoords,
            yCoords,
            // TODO: Change dummyData to messageHistory after connecting to BE
            dummyData,
            transactionNumber
        );

        const { labelsX, labelsY } = generateLabels(xCoords, yCoords);

        const svg = d3
            .select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .classed("flex", true)
            .classed("justify-center", true)
            .classed("items-center", true);

        svg
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 2)
            .attr("fill", `${!theme ? "black" : "white"}`);

        const lineGen = line()
            .x((d) => d.x)
            .y((d) => d.y);

        // ARROW HEAD
        ACTION_TYPE_PBFT_GRAPH.forEach((action, index) =>
            svg
                .append("defs")
                .append("marker")
                .attr("id", `arrow-${action}`)
                .attr("viewBox", "0 0 10 10")
                .attr("refX", 10)
                .attr("refY", 5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto-start-reverse")
                .append("path")
                .attr("fill", `${COLORS_PBFT_GRAPH[index]}`)
                .attr("d", "M 0 0 L 10 5 L 0 10 z")
        );

        // VERTICAL DOTTED LINES
        verticalLines.forEach((line, index) =>
            svg
                .append("path")
                .attr("d", lineGen(line))
                .attr("stroke", "gray")
                .attr("fill", "none")
                .attr("stroke-width", 0.2)
                .attr("stroke-dasharray", "5,10")
        );

        // HORIZONTAL DOTTED LINES
        horizontalLines.forEach((line, index) =>
            svg
                .append("path")
                .attr("d", lineGen(line))
                .attr("stroke", "gray")
                .attr("fill", "none")
                .attr("stroke-width", 0.2)
                .attr("stroke-dasharray", "5,10")
        );

        // LABELS FOR EACH ACTION
        labelsX.forEach((label) =>
            svg
                .append("text")
                .attr("transform", "translate(" + label.x + " ," + label.y + ")")
                .attr("fill", "#c4c4c4")
                .style("text-anchor", "middle")
                .text(`${label.title}`)
        );

        // LABELS FOR EACH NODE
        labelsY.forEach((label, index) => {
            const labelText = svg
                .append("text")
                .attr("transform", "translate(" + label.x + " ," + label.y + ")")
                .style("text-anchor", "middle")
                .text(`${label.title}`)
                .attr("fill", "#c4c4c4")

            if (index === primaryIndex) labelPrimaryNode(svg, label);
            return labelText;
        });

        // REQUEST LINES
        points.request.end.forEach((end, i) => {
            if (end.flag) {
                console.log('REQUEST POINTS', points.request.color);
                connectionRender([points.request.start[0].points, end.points], points.request.color, 'gray', TRANSDURATION_PBFT_GRAPH, i * 2000, lineGen, svg, 'request');
            }
        });

        // PRE-PREPARE LINES
        points.prePrepare.end.forEach((end, i) => {
            if (end.flag) {
                connectionRender([points.prePrepare.start[0].points, end.points], points.prePrepare.color, 'gray', TRANSDURATION_PBFT_GRAPH + 2000, i * 2000, lineGen, svg, 'prePrepare');
            }
        });

        // PREPARE LINES
        points.prepare.start.map((start, index) =>
            points.prepare.end[index].map((end, i) => {
                return (
                    end.flag && connectionRender([start, end.points], points.prepare.color, 'gray', TRANSDURATION_PBFT_GRAPH + 3000, i * 3000, lineGen, svg, 'prepare')
                );
            })
        );

        // COMMIT LINES
        points.commit.start.map((start, index) =>
            points.commit.end[index].map((end, i) => {
                return (
                    end.flag && connectionRender([start, end.points], points.commit.color, 'gray', TRANSDURATION_PBFT_GRAPH + 4000, i * 4000, lineGen, svg, 'commit')
                );
            })
        );

        // REPLY LINES
        points.reply.start.forEach((start, i) => {
            return (
                start.flag && connectionRender([start.points, points.reply.end[0].points], points.reply.color, 'gray', TRANSDURATION_PBFT_GRAPH + 3000, i * 3000, lineGen, svg, 'reply')
            );
        });
    }, [theme, width, height]);

    useEffect(() => {
        debouncedRender();
    }, [debouncedRender]);

    useEffect(() => {
        console.log("MESSAGE HISTIRY", messageHistory);
    }, [messageHistory]);

    const hideGraph = () => {
        setGraphHide(graphHide => !graphHide);
        setTimeout(() => {
            hideGraph()
        }, 5000)
    }

    return (
        <>
            <div className="flex items-center justify-between gap-x-16 mb-[-1em] mt-2">
                <IconButtons title={'Play'} onClick={() => hideGraph()}>
                    <Icon path={playIcon} viewBox={'0 0 384 512'} height={'13px'} />
                </IconButtons>
                <IconButtons title={'Clear'} onClick={() => hideGraph()}>
                    <Icon path={cancelIcon} viewBox={'0 0 384 512'} height={'14px'} />
                </IconButtons>
            </div>
            <div className='relative w-full h-full pl-4 pr-2 pb-6'>
                {resizing ? (
                    <div class='loader'>
                        <div>PBFT</div>
                        <div class='inner' />
                    </div>
                ) : (
                    <>
                        {!graphHide && <svg ref={ref} className='absolute'></svg>}
                    </>
                )}
            </div>
        </>
    );
};

export default PBFT;
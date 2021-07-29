import { Box, LinearProgress, Typography } from "@material-ui/core";
import { last } from "ramda";
import React from "react";
import Debug from "debug";

const debug = Debug("NotebookProgress");

export const NotebookProgress = ({output, metadata}) => {
    if (!output?.log)
        return null;
    const progress = getProgress(output.log, metadata.numCells)*100;
    debug(progress);
    
    if (progress >= 100 || progress <= 1)
      return null;

    return  <Box display="flex" alignItems="center">
    <Box width="100%" mr={1}>
        <LinearProgress value={progress} variant="determinate" color="secondary" />
    </Box>
    <Box minWidth={35}>
      <Typography variant="body2" color="textSecondary">{`${Math.floor(
        progress
      )}%`}</Typography>
    </Box>
  </Box>
    
}


export const getProgress = (log, numCells) => {
    const updateText = last(
            log
            .split("\n")
            .filter(s => s.startsWith("Ending Cell"))
        );

    if (!updateText)
        return 0;
    
    const cellNo = parseInt(updateText.split("Ending Cell ")[1]) - 1;
    return cellNo / numCells;
}
        
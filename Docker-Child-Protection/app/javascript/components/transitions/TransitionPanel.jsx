import React, { useState } from "react";
import PropTypes from "prop-types";
import { ExpansionPanel } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { TRANSITION_PANEL_NAME as NAME } from "./constants";
import styles from "./styles.css";

const TransitionPanel = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = () => {
    setExpanded(!expanded);
  };
  const css = makeStyles(styles)();

  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={handleExpanded}
      className={css.panel}
    >
      {children}
    </ExpansionPanel>
  );
};

TransitionPanel.displayName = NAME;

TransitionPanel.propTypes = {
  children: PropTypes.node.isRequired
};

export default TransitionPanel;

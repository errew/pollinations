import React from "react";
import Form from "@rjsf/material-ui";
import Button from '@material-ui/core/Button'
import Debug from "debug";
import { Box } from "@material-ui/core";

const debug = Debug("Form");

const FormView = ({ input, status, colabState, metadata, nodeID, onSubmit, onCancel}) => {

    const filledForm = getFormInputs(input, metadata);

    if (!filledForm)
        return null;

    debug("colabState",colabState)

    const showSubmit = status === "disconnected" || status === "ready" && colabState !== "running" ;
    const formDisabled = status === "disconnected" ;
    const cancelling = input && input.cancelled;

    debug("nodeID",nodeID, formDisabled)
    const uiSchema = getUISchema(filledForm, showSubmit)
    
    debug("form uiSchema", uiSchema, filledForm, showSubmit)


    return <Form
        schema={{properties: filledForm}}
        uiSchema={uiSchema}
        onSubmit={({formData}) => onSubmit(formData)}
        disabled={formDisabled}
    >
        <Box m={1}>
            {
                showSubmit 
                ?   <Button type="submit" disabled={formDisabled} variant="outlined">
                        Submit
                    </Button>
                :    <Button type="button" color="secondary" onClick={onCancel} disabled={formDisabled || cancelling} variant="outlined">
                        {cancelling ? "Cancelling...": "Cancel"}
                    </Button>
            }
        </Box>
    </Form>
}

export default React.memo(FormView)


function getFormInputs(ipfs, metadata) {
    if ((metadata === undefined) || (metadata === null)) return;
    ipfs = ipfs || {};

    return Object.fromEntries(Object.entries(metadata.form.properties).map(
            ([formKey, prop]) => [formKey, formKey in ipfs ? { ...prop, "default": ipfs[formKey] } : prop]))
}


const getUISchema = (filledForm, enabled) =>
    Object.fromEntries(Object.keys(filledForm).map(key => [key, toSchema(key, enabled)]))


const toSchema = (key, enabled) => {
    const mappings = [
        ["text_","text"],
        ["file_","file"],
        ["num_","updown"],
        ["","text"]
    ];

    return { 
        "ui:widget": mappings.find(([keyPrefix, _]) => key.startsWith(keyPrefix))[1],
        "ui_disabled": !enabled
    }

}

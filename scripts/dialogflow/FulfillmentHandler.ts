import { FulfillmentRequest, FulfillmentResponse } from "../dialogflow/Types";
import { SlackMessage } from "../slack/Types";
import { IntentDispatcher } from "../core/dispatcher/IntentDispatcher";
import { inject, injectable } from "inversify";
import * as _ from "lodash";


@injectable()
export class FulfillmentHandler {
    constructor( @inject("IntentDispatcher") private intentDispatcher: IntentDispatcher) {
    }

    async handle(event: FulfillmentRequest): Promise<FulfillmentResponse> {
        if (!event.result.metadata.intentName) {
            console.log("No intent specified.");
            return {};
        }

        try {
            let response: SlackMessage | SlackMessage[] = await this.intentDispatcher.dispatch<any, any>(
                event.result.metadata.intentName,
                event.result.parameters);
            response = _.isArray(response) ? response : [response];

            let fulfillmentResponse = {
                speech: response[0].text,
                displayText: response[0].text,
                data: {
                    slack: response[0]
                }
            };

            console.log("fulfillment response: %j", fulfillmentResponse);

            return fulfillmentResponse;
        } catch (e) {
            console.error(e);
            return {
                speech: `D'oh! Something went wrong (${e}).`,
                displayText: `D'oh! Something went wrong (${e}).`
            };
        }
    }
}

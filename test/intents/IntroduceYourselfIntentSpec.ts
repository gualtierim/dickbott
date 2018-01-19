import "reflect-metadata";
import { IMock, Mock, Times, It } from "typemoq";
import { Container } from "inversify";
import { Intent } from "../../scripts/core/intent/Intent";
import { SlackMessage } from "../../scripts/slack/Types";
import { IntroduceYourselfIntent, IntroduceYourselfEntities } from "../../scripts/intents/IntroduceYourselfIntent";
import expect = require("expect.js");


describe("Given an Introduce Yourself intent from the User", () => {

    let intent: Intent<IntroduceYourselfEntities, SlackMessage>,
        container: Container;

    beforeEach(() => {
        container = new Container();
        container.bind<Container>("Container").toConstantValue(container);

        intent = new IntroduceYourselfIntent(container);
    });

    context("when executed", () => {
        beforeEach(() => {
            container.bind<Intent<IntroduceYourselfEntities, SlackMessage>>("Intent").to(IntroduceYourselfIntent).whenTargetNamed("Intent");
        });

        it("should return a slack message with all Intents", async () => {

            let slackMessage = await intent.execute("execution-id", {});

            expect(slackMessage).to.be.eql(
                require("../data/intents/IntroduceYourselfIntent.response.json")
            );
        });
    });
});

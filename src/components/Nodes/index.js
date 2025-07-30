import { ManualTrigger } from "./ManualTrigger";
import { ScheduleTrigger } from "./ScheduleTrigger";
import { HttpRequest } from "./HttpRequest";
import { Code } from "./Code";
import { Webhook } from "./Webhook";
import { EditFields } from "./EditFields";
import { ExtractFromFile } from "./ExtractFromFile";
import { AiAgent } from "./AiAgent";
import { GoogleSheet } from "./GoogleSheet";
import { Aggregate } from "./Aggregate";
import { SendAMessage } from "./SendAMessage";

const Nodes = {
    ManualTrigger,
    ScheduleTrigger,
    HttpRequest,
    Code,
    Webhook,
    EditFields,
    ExtractFromFile,
    AiAgent,
    GoogleSheet,
    Aggregate,
    SendAMessage,
};

export default Nodes;

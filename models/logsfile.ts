import { Schema, model, Document } from 'mongoose';

interface ILogs extends Document {
  userID: string;
  date: Date;
  name: string;
  actionType:string;
}

const logsSchema: Schema<ILogs> = new Schema({
  userID: { type: String, required: true },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  actionType: { type: String, required: true },
});

const Logs = model<ILogs>('Logs', logsSchema);

export default Logs;

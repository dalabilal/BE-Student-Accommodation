import { Schema, model, Document } from 'mongoose';

interface IFavorite extends Document {
  userID: string;
  dataId: string;
  name: string;
  description: string;
}

const favoriteSchema: Schema<IFavorite> = new Schema({
  userID: { type: String, required: true },
  dataId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Favorite = model<IFavorite>('Favorite', favoriteSchema);

export default Favorite;

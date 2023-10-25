export interface IDiarySchema {
  _id?: string;
  plantId: string;
  diary?: Array<ISubDiarySchema>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubDiarySchema {
  date: Date;
  entry: string;
}

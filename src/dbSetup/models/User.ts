import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
} from "sequelize-typescript";

interface UserAttributes {
  id: number;
  userId: number;
  regDate: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: number;

  @Column({
    type: DataType.BIGINT,
  })
  declare userId: number;

  @Column({
    type: DataType.STRING,
  })
  declare regDate: string;

  //   @CreatedAt
  //   declare createdAt: Date;

  //   @UpdatedAt
  //   declare updatedAt: Date;
}

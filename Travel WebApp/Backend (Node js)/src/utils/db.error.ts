import { strings } from "@/constants/string.constants";
import Sequelize from "sequelize";

export const getDBErrorMessage = (error:any) => {
  if (!error) {
    return strings.err_unknown_error;
  }
  if (error instanceof Sequelize.UniqueConstraintError) {
    return strings.msg_item_exists;
  } else if (error instanceof Sequelize.ForeignKeyConstraintError) {
    return strings.err_foreign_key_error;
  } else if (error instanceof Sequelize.UnknownConstraintError) {
    return strings.err_unknown_error;
  } else if (error instanceof Sequelize.DatabaseError) {
    return strings.err_database_error;
  } else {
    return strings.err_internal_error_occurred;
  }
};

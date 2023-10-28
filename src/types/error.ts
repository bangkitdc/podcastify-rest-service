import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type PrismaErrorUniqueConstraint = PrismaClientKnownRequestError & {
  meta: {
    target: string[];
  };
}

export type PrismaErrorForeignKeyConstraint = PrismaClientKnownRequestError & {
  meta: {
    field_name: string;
  };
}
import ITodo from "../types/ITodo";

const dbTodoToClient = (todo: {
  id?: string;
  content?: string;
  activity_status?: boolean;
}) => {
  const { id, content, activity_status } = todo;

  return {
    id,
    value: content,
    isActive: activity_status,
  };
};

export default dbTodoToClient;

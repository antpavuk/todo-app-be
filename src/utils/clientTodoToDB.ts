const clientTodoToDB = (todo: {
  id?: string;
  value?: string;
  isActive?: boolean;
}) => {
  const { id, value, isActive } = todo;

  return {
    id,
    content: value,
    activity_status: isActive,
  };
};

export default clientTodoToDB;

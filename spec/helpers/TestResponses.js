var TestResponses = {
  validate: {
    failure: {
      status: 422,
      responseText: '{"user": {"colors": ["can\'t be blank"]}}'
    },
    success: {
      status: 200,
      responseText: '{}'
    }
  }
};

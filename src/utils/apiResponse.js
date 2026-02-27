function success(res, data, message = "OK", status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }
  
  function failure(res, message = "Error", status = 500, errors = []) {
    return res.status(status).json({
      success: false,
      message,
      errors,
    });
  }
  
  module.exports = { success, failure };
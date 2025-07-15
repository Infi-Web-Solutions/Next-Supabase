const systemUserModel = {
  create(data = {}) {
    return {
      id: data.id, // required
      name: data.name || '',
      email: data.email || null,
      contact_number: data.contact_number || null,
      role_id: data.role_id || null,
      created_by: data.created_by || null,
      created_at: new Date().toISOString()
    };
  }
};

export default systemUserModel;

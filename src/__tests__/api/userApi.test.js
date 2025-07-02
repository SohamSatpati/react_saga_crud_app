import * as userApi from '../../api/userApi';

describe('userApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getUsers', () => {
    it('returns users on success', async () => {
      const users = [{ id: 1, name: 'Alice' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => users,
      });
      const result = await userApi.getUsers();
      expect(result).toEqual(users);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/users');
    });

    it('throws error on failure', async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      await expect(userApi.getUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('createUser', () => {
    it('returns created user on success', async () => {
      const newUser = { id: 1, name: 'Alice' };
      const createdUser = { id: 2, name: 'Bob' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdUser,
      });
      const result = await userApi.createUser(newUser);
      expect(result).toEqual(createdUser);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
      );
    });

    it('throws error on failure', async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      await expect(userApi.createUser({})).rejects.toThrow(
        'Failed to create user'
      );
    });
  });

  describe('getUserById', () => {
    it('returns user by id on success', async () => {
      const user = { id: 1, name: 'Alice' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => user,
      });
      const result = await userApi.getUserById(1);
      expect(result).toEqual(user);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/users/1');
    });
    it('throws error on failure', async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      await expect(userApi.getUserById(1)).rejects.toThrow(
        'Failed to fetch user with id 1'
      );
    });
  });

  describe('UpdateUser', () => {
    it('updates user by id on success', async () => {
      const user = { id: 1, name: 'Alice' };
      const updatedUser = { id: 1, name: 'Alice Updated' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedUser,
      });
      const result = await userApi.updateUser(1, user);
      expect(result).toEqual(updatedUser);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users/1',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })
      );
    });

    it('throws error on failure', async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      await expect(userApi.updateUser(1, {})).rejects.toThrow(
        'Failed to update user with id 1'
      );
    });
  });

  describe('deleteUser', () => {
    it('returns deleted user on success', async () => {
      const deletedUser = { id: 1, name: 'Alice' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => deletedUser,
      });
      const result = await userApi.deleteUser(1);
      expect(result).toEqual(deletedUser);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('throws error on failure', async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      await expect(userApi.deleteUser(1)).rejects.toThrow(
        'Failed to delete user with id 1'
      );
    });
  });
});

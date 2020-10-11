import { act, renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to Sign in', async () => {
    const apiResponse = {
      user: {
        id: 'id123',
        name: 'John Doe',
        email: 'johndoe@example.com.br',
      },
      token: 'token-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com.br',
      password: '123456',
    });

    // every set is an await function
    await waitForNextUpdate();

    // testing if there is token into the storage after sign in
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user)
    );

    expect(result.current.user.email).toEqual('johndoe@example.com.br');
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'id123',
            name: 'John Doe',
            email: 'johndoe@example.com.br',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com.br');
  });

  it('should be able to Sign out', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'id123',
            name: 'John Doe',
            email: 'johndoe@example.com.br',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // when we use a function synchrounous and update any state, we should use act
    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toBeCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update the user', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'id123',
      name: 'John Doe',
      email: 'johndoe@example.com.br',
      avatar_url: 'image.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user)
    );

    expect(result.current.user).toEqual(user);
  });
});

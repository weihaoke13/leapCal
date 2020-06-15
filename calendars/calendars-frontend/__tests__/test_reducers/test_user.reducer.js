import { users } from '../../src/_reducers/users.reducer'
import { userConstants } from '../../src/_constants/user.constants'

const initial_state = {
        isAdmin: false,
        logging_in: false,
      };

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(users(initial_state, {})).toEqual(
      {
        isAdmin: false,
        logging_in: false
      }
    )
  });
});
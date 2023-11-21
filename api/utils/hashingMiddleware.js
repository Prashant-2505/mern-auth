
import bcryptjs from 'bcryptjs';


export const hashing = (password) => {
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

export const comparePasswords = async (plainTextPassword, hashedPassword) => {
  try {
    const isMatch = await bcryptjs.compareSync(plainTextPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

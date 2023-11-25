const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../../middlewares/auth');

const { getUser, updateUser } = require('../../controllers/users');

router.get('/me', auth, getUser);
router.post(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

module.exports = router;

const Card = require('../models/card');
const { DatabaseError, Status } = require('../error');

module.exports = {
  getAllCards: (req, res, next) => {
    Card.find({})
      .populate(['owner', 'likes'])
      .then((result) => {
        res.status(Status.OK).send(result);
      })
      .catch(next);
  },
  createCard: (req, res, next) => {
    req.body.owner = req.user._id;
    Card.create(req.body)
      // create() не поддерживает метод populate(), поэтому запросим созданный элемент явно
      .then((createdCard) => {
        Card.findById(createdCard._id)
          .populate(['owner', 'likes'])
          .then((result) => {
            res.status(Status.CREATED).send({ data: result });
          })
          .catch(next);
      })
      .catch(next);
  },
  deleteCard: (req, res, next) => {
    const { cardId } = req.params;
    Card.findById(cardId)
      .then((foundCard) => {
        if (!foundCard) throw new DatabaseError('Карточка не найдена');
        Card.findByIdAndRemove(cardId)
          .then((oldCard) => {
            res.status(Status.OK).send(oldCard);
          })
          .catch(next);
      })
      .catch(next);
  },
  putLike: (req, res, next) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate('likes')
      .then((updatedCard) => {
        if (!updatedCard) throw new DatabaseError('Карточка не найдена');
        res.status(Status.OK).send(updatedCard);
      })
      .catch(next);
  },
  removeLike: (req, res, next) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate('likes')
      .then((updatedCard) => {
        if (!updatedCard) throw new DatabaseError('Карточка не найдена');
        res.status(Status.OK).send(updatedCard);
      })
      .catch(next);
  },
};

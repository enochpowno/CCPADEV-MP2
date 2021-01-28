import { Router } from 'express';
import { ReviewControlelr } from '../controller';
import { mustLogin } from './helpers';

const paginationOptions = {
  sort: 'date',
  page: 1,
  limit: 15,
  lean: true,
};

export default (function () {
  const route = Router();

  route.get('/:movie', (_req, _res) => {
    const pageOptClone = {
      ...paginationOptions,
      page: (_req.query.page && _req.query.page >= 1) ? parseInt(_req.query.page, 10) : 1,
    };

    ReviewControlelr.paginate({
      filter: {
        movie: _req.params.movie,
      },
      options: pageOptClone,
    }).then((result) => _res.send(result));
  });

  route.post('/', (_req, _res) => {
    if (mustLogin(_req)) {
      ReviewControlelr.create({
        content: _req.body.content,
        user: _req.session.user._id,
        movie: _req.body.movie,
        title: _req.body.title,
      }).then((result) => _res.send(result));
    } else {
      _res.send({
        success: false,
        message: '',
        results: null,
        errors: ['Uh oh! You\'re not allowed to do that!'],
      });
    }
  });

  route.delete('/', (_req, _res) => {
    if (mustLogin(_req)) {
      if (_req.body.review) {
        ReviewControlelr.delete({
          filter: {
            _id: _req.body.review,
            user: _req.session.user._id,
          },
        }).then((result) => _res.send(result));
      } else {
        _res.send({
          success: false,
          message: '',
          results: null,
          errors: ['Oops! We can\'t find the review you\'re trying to delete'],
        });
      }
    } else {
      _res.send({
        success: false,
        message: '',
        results: null,
        errors: ['Uh oh! You\'re not allowed to do that!'],
      });
    }
  });

  route.put('/', (_req, _res) => {
    if (mustLogin(_req)) {
      ReviewControlelr.update({
        filter: {
          _id: _req.body.review,
          user: _req.session.user._id,
        },
        updates: {
          content: _req.body.content,
          title: _req.body.title,
        },
      }).then((result) => _res.send(result));
    } else {
      _res.send({
        success: false,
        message: '',
        results: null,
        errors: ['Uh oh! You\'re not allowed to do that!'],
      });
    }
  });

  return route;
}());
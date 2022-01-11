const configConstants = {
  api: {
    baseUrl: 'https://fast-eyrie-03100.herokuapp.com/api/',
    tourism: {
      path: 'touristicPlace/',
      mainImage: 'mainImage/',
      tagImage: 'imageTag/',
      getAll: 'getAll',
      getCategories: 'categories',
      byLocation: 'searchByLocation',
      byId: 'getById',
      image: 'image/',
      comments: 'commentsByTouristicPlaceId',
      setComment: 'modifyCommentary',
      getEvents: 'events',
      userRate: 'userRate',
      checkFavorite: 'checkFavorite',
      editFavorite: 'editFavorite',
      placesByFav: 'placesByFav'
    },
    user: {
      path: 'users/',
      authentication: 'authentication',
      userById: 'getUser',
      updateProfile: 'update',
      registerAccount: 'saveUser',
      verificateCode: 'verificateCode',
      resetPassword: 'resetPassword'
    }
  }
};

export { configConstants };

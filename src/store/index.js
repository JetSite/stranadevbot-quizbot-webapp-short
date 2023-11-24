import { create } from "zustand";

const useStore = create((set, get) => ({
  data: {
    nameSuccessBack: false,
    id: "",
    questions: [],
    paginationPage: 1,
    tags: [],
    ipotekaPrice: 0,
    ipotekatTags: [],
    activeDevelopment: [],
    activeCities: [],
    activeFilters: [],
    filtersData: [],
    filtersCount: 0,
    sortFilterPrice: "asc",
    sortFilterRoom: "asc",
    activeFilterPrice: true,
    activeFilterRoom: false,
    prevData: [],
    user: {
      UserTelegamID: "",
      UserTelegramUsername: "",
      UserTelegramName: "",
      UserName: "",
      subscriptions: [],
      cities: [],
    },
  },
  setSortActiveFilters: ({
    activeFilterPrice = true,
    activeFilterRoom = false,
    sortFilterRoom = "asc",
    sortFilterPrice = "asc",
  }) => {
    set((state) => ({
      data: {
        ...state.data,
        activeFilterPrice,
        activeFilterRoom,
        sortFilterRoom,
        sortFilterPrice,
      },
    }));
  },
  setSortFilterPrice: () => {
    const sortPrice = get().data.sortFilterPrice;
    const active = get().data.activeFilterPrice;
    if (active) {
      set((state) => ({
        data: {
          ...state.data,
          sortFilterPrice: sortPrice === "asc" ? "desc" : "asc",
        },
      }));
    } else {
      set((state) => ({
        data: {
          ...state.data,
          activeFilterRoom: false,
          activeFilterPrice: true,
        },
      }));
    }
  },
  setSortFilterRoom: () => {
    const sortRoom = get().data.sortFilterRoom;
    const active = get().data.activeFilterRoom;
    if (active) {
      set((state) => ({
        data: {
          ...state.data,
          sortFilterRoom: sortRoom === "asc" ? "desc" : "asc",
        },
      }));
    } else {
      set((state) => ({
        data: {
          ...state.data,
          activeFilterRoom: true,
          activeFilterPrice: false,
        },
      }));
    }
  },
  setFiltersCount: (number) => {
    set((state) => ({ data: { ...state.data, filtersCount: number } }));
  },
  setPrevData: (data) => {
    const prevData = get().data.prevData;
    if (data?.length >= prevData?.length) {
      set((state) => ({ data: { ...state.data, prevData: data } }));
    }
  },
  setActiveFilters: (arr) => {
    set((state) => ({ data: { ...state.data, activeFilters: arr } }));
  },
  setPaginationPage: (page) => {
    set((state) => ({ data: { ...state.data, paginationPage: page } }));
  },
  setFiltersData: (initialData) => {
    const cities = get().data.user.cities;
    let normalizeCities = [];
    cities?.forEach((city) => {
      const dev = [];
      initialData?.forEach((item) => {
        if (city?.id === item?.attributes?.city?.data?.id) {
          dev.push(item);
        }
      });
      normalizeCities.push({ city, dev });
    });

    set((state) => {
      return {
        data: {
          ...state.data,
          filtersData: normalizeCities,
          activeCities: state.data.activeCities.length
            ? state.data.activeCities
            : cities,
        },
      };
    });
  },
  setNameSuccessBack: (nameSuccessBack) =>
    set((state) => ({
      data: { ...state.data, nameSuccessBack: nameSuccessBack },
    })),
  setActiveDevelopment: (arr) => {
    set((state) => ({
      data: {
        ...state.data,
        activeDevelopment: arr,
      },
    }));
  },
  setActiveCities: (arr) => {
    set((state) => ({
      data: {
        ...state.data,
        activeCities: arr,
      },
    }));
  },
  clearActiveDevelopment: () =>
    set((state) => ({
      data: { ...state.data, activeDevelopment: [] },
    })),
  setUser: (user) =>
    set((state) => ({
      data: { ...state.data, user: { ...user } },
    })),
  setQuestions: (answer) => {
    const questions = get().data.questions;
    if (questions.find((item) => item.id === answer.id)) {
      const questionsDelete = questions.filter((item) => item.id !== answer.id);
      set((state) => ({
        data: { ...state.data, questions: [...questionsDelete, answer] },
      }));
    } else {
      set((state) => ({
        data: { ...state.data, questions: [...questions, answer] },
      }));
    }
  },
  clearQuestions: () =>
    set((state) => ({
      data: { ...state.data, questions: [], tags: [] },
    })),
  clearFilters: () =>
    set((state) => ({
      data: {
        ...state.data,
        activeDevelopment: [],
        activeCities: [],
        activeFilters: [],
        filtersData: [],
        filtersCount: 0,
        sortFilterPrice: "asc",
        sortFilterRoom: "asc",
        activeFilterPrice: true,
        activeFilterRoom: false,
      },
    })),
  clearFiltersDevelopment: () =>
    set((state) => ({
      data: {
        ...state.data,
        activeDevelopment: [],
        filtersData: [],
        activeFilters: [],
        filtersCount: 0,
      },
    })),
  setTags: () => {
    const questions = get().data.questions;
    const newTags = [];
    questions.forEach((item) => {
      item?.answer?.forEach((el) => {
        if (el?.app_tags?.data?.length) {
          el?.app_tags?.data.forEach((tag) => newTags.push(tag?.id));
        }
      });
    });
    console.log(Array.from(new Set(newTags)));
    set((state) => ({
      data: { ...state.data, tags: Array.from(new Set(newTags)) },
    }));
  },
  setIpotekaPrice: (priceCustom = 0) => {
    const questions = get().data.questions;
    let price = 0;
    console.log(priceCustom);
    if (priceCustom > 0) {
      set((state) => ({
        data: { ...state.data, ipotekaPrice: priceCustom },
      }));
    } else {
      questions.forEach((item) => {
        if (item.id === 1) {
          price = item.answer[0];
        }
      });
      console.log(price);
      set((state) => ({
        data: { ...state.data, ipotekaPrice: price },
      }));
    }
  },
  setIpotekaIds: () => {
    const questions = get().data.questions;
    let ipotekaTags = [];
    questions.forEach((item) => {
      item?.answer?.forEach((el) => {
        if (el?.ipoteka?.data?.id) {
          ipotekaTags.push(el?.ipoteka?.data?.id);
        }
      });
    });
    console.log(ipotekaTags);
    set((state) => ({
      data: { ...state.data, ipotekaTags },
    }));
  },
  setUserName: (name) =>
    set((state) => ({
      data: { ...state.data, user: { ...state.data.user, UserName: name } },
    })),
  setId: (id) =>
    set((state) => ({
      data: { ...state.data, id },
    })),
  updateUserStore: (mutation) => {
    const id = get().data.id;
    const user = get().data.user;
    mutation.mutate({ data: { ...user }, id });
  },
  // setCities: (city, mutation) => {
  //   const cities = get().data.user.cities
  //   const id = get().data.id
  //   if (cities?.find((item) => item.id === city.id)) {
  //     mutation.mutate({
  //       telegram_user: id,
  //       Action: `Убрал город ${city?.attributes?.CityName}`,
  //     })
  //     set((state) => ({
  //       data: {
  //         ...state.data,
  //         user: {
  //           ...state.data.user,
  //           cities: cities.filter((item) => item.id !== city.id),
  //         },
  //       },
  //     }))
  //   } else {
  //     mutation.mutate({
  //       telegram_user: id,
  //       Action: `Добавил город ${city?.attributes?.CityName}`,
  //     })
  //     set((state) => ({
  //       data: {
  //         ...state.data,
  //         user: {
  //           ...state.data.user,
  //           cities: [...cities, city],
  //         },
  //       },
  //     }))
  //   }
  // },
  setCities: (city, mutation) => {
    const id = get().data.id;
    mutation.mutate({
      telegram_user: id,
      Action: `Поменял на город ${city?.attributes?.CityName}`,
    });
    set((state) => ({
      data: {
        ...state.data,
        user: {
          ...state.data.user,
          cities: [city],
        },
      },
    }));
  },
  setAllCities: (arr) => {
    set((state) => ({
      data: {
        ...state.data,
        user: { ...state.data.user, cities: arr },
      },
    }));
  },
  setSubscriptions: (subscription, mutation) => {
    const subscriptions = get().data.user.subscriptions;
    const id = get().data.id;
    if (subscriptions?.find((item) => item.id === subscription.id)) {
      mutation.mutate({
        telegram_user: id,
        Action: `Убрал подписку ${subscription?.attributes?.SubscriptionTitle}`,
      });
      set((state) => ({
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            subscriptions: subscriptions.filter(
              (item) => item.id !== subscription.id
            ),
          },
        },
      }));
    } else {
      mutation.mutate({
        telegram_user: id,
        Action: `Добавил подписку ${subscription?.attributes?.SubscriptionTitle}`,
      });
      set((state) => ({
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            subscriptions: [...subscriptions, subscription],
          },
        },
      }));
    }
  },
}));

export default useStore;

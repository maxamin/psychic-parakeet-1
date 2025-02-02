import resp from "../src/data/test.json";

var res;
res = resp;

export const searchForFlight = async (data) => {
  // console.log(data)

  let response;

  let legsCount = res.legs.length;
  let totalTrips = [];
  for (let i = 0; i < legsCount; i++) {
    let leg = res?.legs[i];

    let trip = {
      from: leg.departureAirportCode,
      fromTime: leg.departureDateTime,
      to: leg.arrivalAirportCode,
      toTime: leg.arrivalDateTime,
      stopoversCount: leg.stopoversCount,
      isConnecting: leg.stopoversCount > 0 ? true : false,
      paths: leg.segments,
      totalTime: leg.duration,
      airlines: leg.airlineCodes,
    };
    let id = "";
    for (let i = 0; i <= leg.stopoversCount; i++) {
      id += `${leg.id.split(":")[i + 1]}`;
      if (i != leg.stopoversCount) {
        id += `-`;
      }
    }

    trip = {
      ...trip,
      id: id,
      price: res?.fares?.filter((fare) => fare.tripId.split(":")[1] === id)[0]
        ?.price?.totalAmount,
    };

    totalTrips.push(trip);
  }

  response = {
    totalTrips,
    pages: {
      total: (Math.ceil(legsCount / 10) * 10) / 10,
      current: 0,
    },
    filter: {
      duration: {
        value: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.durationMinutes;
          })
        ),
        max: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.durationMinutes;
          })
        ),
        min: Math.min.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.durationMinutes;
          })
        ),
      },
      stops: {
        value: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.stopoversCount;
          })
        ),
        max: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.stopoversCount;
          })
        ),
        min: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.stopoversCount;
          })
        ),
      },
      airlines: res.airlines,
      price: {
        value: Math.max.apply(
          Math,
          totalTrips.map(function (trip) {
            return trip.price;
          })
        ),
        min: Math.min.apply(
          Math,
          totalTrips.map(function (trip) {
            return trip.price;
          })
        ),
        max: Math.max.apply(
          Math,
          totalTrips.map(function (trip) {
            return trip.price;
          })
        ),
      },
    },
  };

  // console.log(data);
  // const url =  `https://api.flightapi.io/onewaytrip/63f89b79a55b1d9880138f7f/${data.from}/${data.to}/${data.date}/${data.adults}/${data.children}/${data.infants}/Economy/USD`
  // await fetch(url).then((res) =>
  //   res.json().then((data) => {
  //     if (!res.ok) throw data;
  //     response = data;
  //     console.log(response)
  //   })
  // );
  return response;
};

export const filterAndSend = async (filter) => {
  console.log(filter);
  const { airlines, duration, stops, price } = filter;

  let response;

  let legsCount = res.legs.length;
  let filteredLegsCount = 0;
  let totalTrips = [];
  for (let i = 0; i < legsCount; i++) {
    let id = "";
    let leg = res?.legs[i];
    for (let i = 0; i <= leg.stopoversCount; i++) {
      id += `${leg.id.split(":")[i + 1]}`;
      if (i != leg.stopoversCount) {
        id += `-`;
      }
    }
    let legPrice = res?.fares?.filter(
      (fare) => fare.tripId.split(":")[1] === id
    )[0]?.price?.totalAmount;

    if (
      leg.durationMinutes <= duration.value &&
      leg.stopoversCount <= stops.value &&
      legPrice <= price.value
    ) {
      let trip = {
        from: leg.departureAirportCode,
        fromTime: leg.departureDateTime,
        to: leg.arrivalAirportCode,
        toTime: leg.arrivalDateTime,
        stopoversCount: leg.stopoversCount,
        isConnecting: leg.stopoversCount > 0 ? true : false,
        paths: leg.segments,
        totalTime: leg.duration,
        airlines: leg.airlineCodes.reverse(),
      };

      trip = {
        ...trip,
        id: id,
        price: legPrice,
      };

      totalTrips.push(trip);
      filteredLegsCount += 1;
    }
  }

  response = {
    totalTrips,
    pages: {
      total: (Math.ceil(filteredLegsCount / 10) * 10) / 10,
      current: 0,
    },
    filter: {
      duration: {
        value: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.durationMinutes;
          })
        ),
        max: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.durationMinutes;
          })
        ),
        min: Math.min.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.durationMinutes;
          })
        ),
      },
      stops: {
        value: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.stopoversCount;
          })
        ),
        max: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.stopoversCount;
          })
        ),
        min: Math.max.apply(
          Math,
          res.legs.map(function (leg) {
            return leg.stopoversCount;
          })
        ),
      },
      airlines: res.airlines,
      price: {
        value: Math.max.apply(
          Math,
          totalTrips.map(function (trip) {
            return trip.price;
          })
        ),
        min: Math.min.apply(
          Math,
          totalTrips.map(function (trip) {
            return trip.price;
          })
        ),
        max: Math.max.apply(
          Math,
          totalTrips.map(function (trip) {
            return trip.price;
          })
        ),
      },
    },
  };

  return response;
};

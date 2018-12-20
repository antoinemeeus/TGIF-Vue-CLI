<template>
  <div id="app">
    <b-container xl="*">
      <header>
        <b-row align-h="between" align-v="center">
          <b-col cols="3">
            <a href="index.html">
              <img class="logo-image" src="@/assets/logo.png" alt="TIGF logo">
            </a>
          </b-col>
          <b-col>
            <h1>Transparent Governement - In Fact</h1>
          </b-col>
          <b-col cols="auto">
            <span class="pr-2">
              <a href="mailto:paula.davis@gmail.com">
                <img src="@/assets/iconmonstr-email-3.svg" alt="mail_svg">
              </a>
              <a href="mailto:paula.davis@gmail.com">
                <u>info@tgif.net</u>
              </a>
            </span>
          </b-col>
        </b-row>
      </header>
    </b-container>

    <b-navbar sticky type="dark" variant="dark" toggleable="md">
      <b-container>
        <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">TGIF</b-navbar-brand>
        <b-collapse is-nav id="nav_dropdown_collapse">
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <!-- Navbar dropdowns -->
            <b-nav-item-dropdown text="Congress" right>
              <b-dropdown-item to="/congress/senate">Senate</b-dropdown-item>
              <b-dropdown-item to="/congress/house">House</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Attendance" right>
              <b-dropdown-item to="/analisis/attendance/senate/">Senate</b-dropdown-item>
              <b-dropdown-item to="/analisis/attendance/house/">House</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Loyalty" right>
              <b-dropdown-item to="/analisis/loyalty/senate/">Senate</b-dropdown-item>
              <b-dropdown-item to="/analisis/loyalty/house/">House</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <b-container xl="*">
      <router-view></router-view>
    </b-container>

    <footer class="p-1 fixed-bottom bg-dark text-white">
      <div class="container">
        <!-- Copyright -->
        <div class="text-center">
          © 2018 TGIF |
          <a href>All Rights Reserved</a>
        </div>
        <!-- Copyright -->
      </div>
    </footer>
  </div>
</template>


<script>
export default {
  name: "app",
  data: function() {
    return {};
  },
  mounted() {
    console.log("Checking if API data is up to date");
    var currentDate = new Date();
    var timeDiff = 0;
    var thirtyMinutes = 1800000; //30 minutes in milliseconds
    console.log(currentDate);
    if (localStorage.PropPublica_LastUpdateDate) {
      console.log("Found last update time:");
      console.log(new Date(localStorage.PropPublica_LastUpdateDate));
      timeDiff =
        currentDate - Date.parse(localStorage.PropPublica_LastUpdateDate);
      console.log("Time difference (in minutes)= ");
      console.log(timeDiff / 60000);
    }

    if (timeDiff > thirtyMinutes) {
      console.log("Update Due!");
      console.log("Requesting Senate for update, getting it via API");
      console.log("Making API requests...");
      this.fetchData("senate");
      console.log("Requesting House for update, getting it via API");
      console.log("Making API requests...");
      this.fetchData("house");
    } else {
      console.log(
        "Time difference (in minutes)= " +
          timeDiff / 60000 +
          " is less than:" +
          thirtyMinutes / 60000
      );
      console.log("No update required: ----");
      if (localStorage.proPublicaSenateMembers) {
        let chamber = "senate";
        console.log(
          "The Senate data is in local Storage, loading it via LocalStorage"
        );
        this.$store.commit("updateLoading", {
          curChamber: chamber,
          val: true
        });
        this.$store.commit("setChamberMembers", {
          currentChamber: chamber,
          listOfMembers: JSON.parse(localStorage.proPublicaSenateMembers)
        });
        this.$store.commit("updateLoading", {
          curChamber: chamber,
          val: false
        });
      } else {
        console.log(
          "The Senate data is not in local Storage, getting it via API"
        );
        console.log("Making API requests...");
        this.fetchData("senate");
      }

      if (localStorage.proPublicaHouseMembers) {
        let chamber = "house";
        console.log(
          "The House data  is in local Storage, loading it via LocalStorage"
        );
        this.$store.commit("updateLoading", {
          curChamber: chamber,
          val: true
        });
        this.$store.commit("setChamberMembers", {
          currentChamber: chamber,
          listOfMembers: JSON.parse(localStorage.proPublicaHouseMembers)
        });
        this.$store.commit("updateLoading", {
          curChamber: chamber,
          val: false
        });
      } else {
        console.log(
          "The House data is not in local Storage, getting it via API"
        );
        console.log("Making API requests...");
        this.fetchData("house");
      }
    }
  },
  watch: {
    getMembers(newMembers) {
      console.log("The data changed!! Saving it to local Storage ");
      console.log(newMembers);
      this.saveDataOnLocal(newMembers.senate, "senate");
      this.saveDataOnLocal(newMembers.house, "house");
    }
  },
  computed: {
    getMembers() {
      return this.$store.getters.getMembers;
    }
  },
  methods: {
    saveDataOnLocal: function(memberList, chamber) {
      console.log("Saving...");

      var newdate = new Date();
      var last_update_date = newdate.toString();
      localStorage.PropPublica_LastUpdateDate = last_update_date;
      console.log(last_update_date);
      if (chamber === "senate")
        localStorage.proPublicaSenateMembers = JSON.stringify(memberList);
      if (chamber === "house")
        localStorage.proPublicaHouseMembers = JSON.stringify(memberList);
    },
    fetchData: function(chamber) {
      this.$store.commit("updateLoading", { curChamber: chamber, val: true });
      let self = this;
      let init = {
        headers: new Headers({
          "x-api-key": this.$store.state.PROPUBLICA_API_KEY
        })
      };
      let url = this.$store.getters.getUrlAPI(chamber);
      //console.log(chamber, url);

      fetch(url, init)
        .then(function(resp) {
          if (resp.ok) return resp.json();
          throw new Error(res.statusText);
        })
        .then(function(json) {
          var data = json.results[0].members;
          self.$store.commit("updateLoading", {
            curChamber: chamber,
            val: false
          });
          self.$store.commit("setChamberMembers", {
            currentChamber: chamber,
            listOfMembers: data
          });
          //saving on local storage:
          self.saveDataOnLocal(data, chamber);
        })
        .catch(function(error) {
          // called when an error occurs anywhere in the chain
          console.log("Request failed: " + error);
        });
    }
  }
};
</script>



<style>
@media (min-width: 1200px) {
  .container {
    max-width: 1500px;
  }
}
html {
  font-size: 0.6rem;
}

@media (min-width: 1200px) {
  html {
    font-size: 0.8rem;
  }
}

@media (min-width: 720px) {
  html {
    font-size: 1rem;
  }
}

@media (min-width: 960px) {
  html {
    font-size: 1.2rem;
  }
}
.logo-image {
  width: 16vw;
  max-width: 200px;
}

.navbar-top {
  position: sticky !important;
  top: 67px;
  z-index: 1019;
  border: 1px solid red;
}

.nav-sticky th {
  position: sticky !important;
  top: 204px;
  background: #a0a6ab;
}

/*-------Loader--------------*/

.loader {
  position: relative;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-gap: 2px;
  width: 100px;
  height: 100px;
}
.loader > div {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  background: tomato;
  transform: scale(0);
  transform-origin: center center;
  animation: loader 2s infinite linear;
}
.loader > div:nth-of-type(1),
.loader > div:nth-of-type(5),
.loader > div:nth-of-type(9) {
  animation-delay: 0.4s;
}
.loader > div:nth-of-type(4),
.loader > div:nth-of-type(8) {
  animation-delay: 0.2s;
}
.loader > div:nth-of-type(2),
.loader > div:nth-of-type(6) {
  animation-delay: 0.6s;
}
.loader > div:nth-of-type(3) {
  animation-delay: 0.8s;
}

@keyframes loader {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  80% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>

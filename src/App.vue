<template>
  <div id="app">
    <b-container xl="*">
      <header>
        <b-row
          align-h="between"
          align-v="center"
        >
          <b-col cols="3">
            <a href="index.html">
              <img
                class="logo-image"
                src="@/assets/logo.png"
                alt="TIGF logo"
              >
            </a>
          </b-col>
          <b-col>
            <h1>Transparent Governement - In Fact</h1>
          </b-col>
          <b-col cols="auto">
            <span class="pr-2">
              <a href="mailto:paula.davis@gmail.com">
                <img
                  src="@/assets/iconmonstr-email-3.svg"
                  alt="mail_svg"
                >
              </a>
              <a href="mailto:paula.davis@gmail.com">
                <u>info@tgif.net</u>
              </a>
            </span>
          </b-col>
        </b-row>
      </header>
    </b-container>

    <b-navbar
      sticky
      type="dark"
      variant="dark"
      toggleable="md"
    >
      <b-container>
        <b-navbar-brand
          to="/"
          exact
        >TGIF</b-navbar-brand>
        <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
        <b-collapse
          is-nav
          id="nav_dropdown_collapse"
        >
          <b-navbar-nav>
            <b-nav-item
              to="/"
              exact
            >Home</b-nav-item>
            <!-- Navbar dropdowns -->
            <b-nav-item-dropdown
              text="Congress"
              left
            >
              <b-dropdown-item to="/congress/senate/">Senate</b-dropdown-item>
              <b-dropdown-item to="/congress/house/">House</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown
              text="Attendance"
              left
            >
              <b-dropdown-item to="/analisis/attendance/senate/">Senate</b-dropdown-item>
              <b-dropdown-item to="/analisis/attendance/house/">House</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown
              text="Loyalty"
              left
            >
              <b-dropdown-item to="/analisis/loyalty/senate/">Senate</b-dropdown-item>
              <b-dropdown-item to="/analisis/loyalty/house/">House</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <b-container
      class="pb-4"
      xl="*"
    >
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
  data: function () {
    return {};
  },
  mounted() {
    this.updateCheck();
  },

  methods: {
    updateCheck: function () {
      //Is update date in memory AND Is the time elapsed between fetched data inferior to limit, is fetching data really needed?
      var thirtyMinutes = 1800000; //30 minutes in milliseconds     
      if ((typeof localStorage.propPublica_LastUpdateDate !== "undefined") && (((new Date()) - Date.parse(localStorage.propPublica_LastUpdateDate)) < thirtyMinutes)) {

        //Is the data we need actually in memory?
        if (typeof localStorage.proPublicaSenateMembers !== "undefined") {
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
        }
        else {
          console.log(
            "The Senate data is not in local Storage, getting it via API"
          );
          this.fetchData("senate");
        }

        if (typeof localStorage.proPublicaHouseMembers !== "undefined") {
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
        }
        else {
          console.log(
            "The House data is not in local Storage, getting it via API"
          );
          this.fetchData("house");

        }

      }
      //update date is not in memory, or the update date is superior to 30 minutes elpased time 
      else {
        //Fetch and save
        console.log("Last Update information not found OR time elapsed since last update is superior to limit. Fetching fresh data...");
        this.fetchData("senate");
        this.fetchData("house");
      }
    },
    saveDataOnLocal: function (memberList, chamber) {
      console.log("Saving...");

      var newdate = new Date();
      var last_update_date = newdate.toString();
      localStorage.propPublica_LastUpdateDate = last_update_date;
      console.log(last_update_date);
      var idStr = "proPublica" + chamber.charAt(0).toUpperCase() + chamber.slice(1) + "Members";
      localStorage[idStr] = JSON.stringify(memberList);
    },
    fetchData: function (chamber) {
      console.log("Making API requests...");
      this.$store.commit("updateLoading", { curChamber: chamber, val: true });
      let self = this;
      let init = {
        headers: new Headers({
          "x-api-key": this.$store.state.PROPUBLICA_API_KEY
        })
      };
      let url = this.$store.getters.getUrlAPI(chamber);

      fetch(url, init)
        .then(function (resp) {
          if (resp.ok) return resp.json();
          throw new Error(res.statusText);
        })
        .then(function (json) {
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
        .catch(function (error) {
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
@media (max-width: 436px) {
  html {
    font-size: 1rem;
  }
}
@media (max-width: 435px) {
  html {
    font-size: 0.8rem;
  }
}
@media (max-width: 350px) {
  html {
    font-size: 0.6rem;
  }
}

.nav-sticky th {
  position: sticky !important;
  top: 170px;
  background: #a0a6ab;
}

@media (max-width: 768px) {
  .nav-sticky th {
    top: 190px;
  }
}
@media (max-width: 425px) {
  .nav-sticky th {
    top: 200px;
  }
}
@media (max-width: 320px) {
  .nav-sticky th {
    top: 160px;
  }
}
.logo-image {
  width: 16vw;
  max-width: 200px;
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

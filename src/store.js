import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    senate: {
      htmlContent: '<div><h2>Senators</h2><p>First convened in 1789, the composition and powers of the Senate are established in Article One of the U.S. Constitution. Each state is represented by two senators, regardless of population, who serve staggered six-year terms.</p> <p>The Senate has several exclusive powers not granted to the House, including consenting to treaties as a precondition to their ratification and consenting to or confirming appointments of Cabinet secretaries, federal judges, other federal executive officials, military officers, regulatory officials, ambassadors, and other federal uniformed officers, as well as trial of federal officials impeached by the House.</p></div>'
    },
    house: {

      htmlContent: '<div><h2>House</h2><p>The major power of the House is to pass federal legislation that affects the entire country, although its bills must also be passed by the Senate and further agreed to by the U.S. President before becoming law (unless both the House and Senate re-pass the legislation with a two-thirds majority in each chamber). </p> <p>The House has some exclusive powers: the power to initiate revenue bills, to impeach officials (impeached officials are subsequently tried in the Senate), and to elect the U.S. President in case there is no majority in the Electoral College. Each U.S.state is represented in the House in proportion to its population as measured in the census, but every state is entitled to at least one representative.</p></div>'

    },
    attendancePost: {
      htmlContent: '<div><h2>Attendance</h2><p>The Constitution specifies that a majority of members constitutes a quorum to do business in each house. Representatives and senators rarely force the presence of a quorum by demanding quorum calls; thus, in most cases, debates continue even if a majority is not present.</p> <p>The Senate uses roll-call votes; a clerk calls out the names of all the senators, each senator stating "aye" or "no" when his or her name is announced. The House reserves roll-call votes for the most formal matters, as a roll-call of all 435 representatives takes quite some time; normally, members vote by electronic device. In the case of a tie, the motion in question fails. In the Senate, the Vice President may (if present) cast the tiebreaking vote.</p></div>'
    },
    loyaltyPost: {
      htmlContent: "<div><h2>Party Loyalty</h2><p>Those who consider themselves to be strong partisans, strong Democrats and strong Republicans respectively, tend to be the most faithful in voting for their party's nominee for office and legislation that backs their party's agenda. </p></div>"
    },
    PROPUBLICA_API_KEY: '1utK9P6TpuO6BDzWDp8qE5UcKAiDiQ6xdIkavhNy',
    WEBSITE_API: 'https://api.propublica.org/congress/v1/',
    X_OPTION_BYPASS: 'http://x-frame-options-bypass.herokuapp.com/?url=',
    CONGRESS: 113,
    PCT_RATIO: 10,
    /* -------------------------------------------- */
    FullNameStatesD: {
      'AL': 'Alabama',
      'AK': 'Alaska',
      'AS': 'American Samoa',
      'AZ': 'Arizona',
      'AR': 'Arkansas',
      'CA': 'California',
      'CO': 'Colorado',
      'CT': 'Connecticut',
      'DE': 'Delaware',
      'DC': 'District Of Columbia',
      'FM': 'Federated States Of Micronesia',
      'FL': 'Florida',
      'GA': 'Georgia',
      'GU': 'Guam',
      'HI': 'Hawaii',
      'ID': 'Idaho',
      'IL': 'Illinois',
      'IN': 'Indiana',
      'IA': 'Iowa',
      'KS': 'Kansas',
      'KY': 'Kentucky',
      'LA': 'Louisiana',
      'ME': 'Maine',
      'MH': 'Marshall Islands',
      'MD': 'Maryland',
      'MA': 'Massachusetts',
      'MI': 'Michigan',
      'MN': 'Minnesota',
      'MS': 'Mississippi',
      'MO': 'Missouri',
      'MT': 'Montana',
      'NE': 'Nebraska',
      'NV': 'Nevada',
      'NH': 'New Hampshire',
      'NJ': 'New Jersey',
      'NM': 'New Mexico',
      'NY': 'New York',
      'NC': 'North Carolina',
      'ND': 'North Dakota',
      'MP': 'Northern Mariana Islands',
      'OH': 'Ohio',
      'OK': 'Oklahoma',
      'OR': 'Oregon',
      'PW': 'Palau',
      'PA': 'Pennsylvania',
      'PR': 'Puerto Rico',
      'RI': 'Rhode Island',
      'SC': 'South Carolina',
      'SD': 'South Dakota',
      'TN': 'Tennessee',
      'TX': 'Texas',
      'UT': 'Utah',
      'VT': 'Vermont',
      'VI': 'Virgin Islands',
      'VA': 'Virginia',
      'WA': 'Washington',
      'WV': 'West Virginia',
      'WI': 'Wisconsin',
      'WY': 'Wyoming'
    },
    apiStatsKeys: {
      loyalty_votes_fName: 'votes_with_party_pct',
      engaged_votes_fName: 'missed_votes_pct',
      total_votes_fName: 'total_votes',
      missed_votes_fName: 'missed_votes'
    },
    apiTypeStr: {
      attendance: {
        pct_vote_str: 'missed_votes_pct',
        vote_str: 'missed_votes'
      },
      loyalty: {
        pct_vote_str: 'votes_with_party_pct',
        vote_str: 'total_votes'
      }
    },
    chambers: ['senate', 'house'],
    /* -------------------------------------------- */
    members: {
      senate: [],
      house: []
    },
    loading: {
      senate: true,
      house: true
    }
  },

  getters: {

    getLoadingStatus: state => chamber => {
      return state.loading[chamber]
    },
    getMembers: state => {
      return state.members
    },
    getUrlAPI: state => chamber => {
      return state.WEBSITE_API + state.CONGRESS + '/' + chamber + '/members.json'
    },
    getPartyKeys: state => {
      return state.apiPartyKeys
    },
    getAPI_str_ByType: state => type => {
      return state.apiTypeStr[type]
    },
    getStatsKeys: state => {
      return state.apiStatsKeys
    },
    getFullStatesName: state => {
      return state.FullNameStatesD
    },
    getPctRatio: state => {
      return state.PCT_RATIO
    }
  },

  mutations: {
    updateLoading (state, obj) {
      state.loading[obj.curChamber] = obj.val
    },
    setChamberMembers (state, payload) {
      state.members[payload.currentChamber] = payload.listOfMembers
    }
  },

  actions: {

  }
})

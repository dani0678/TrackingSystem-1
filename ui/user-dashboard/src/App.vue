<template>
<div>
  <Navbar class="navbar" v-bind:info="info" />
  <div id="app">
    <div class="graph">
      <WhereaboutsCard class="where-abouts" v-bind:info="info" />
      <WhereSumCard class="where-sum" v-bind:info="info" />
    </div>
  </div>
</div>
</template>

<script>
import WhereaboutsCard from './components/WhereaboutsCard.vue'
import WhereSumCard from './components/WhereSumCard.vue'
import Navbar from './components/Navbar.vue'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    WhereaboutsCard,
    WhereSumCard,
    Navbar
  },
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('http://xi.eecs.tottori-u.ac.jp/api/get/tracker/abc123')
      .then(response => (this.info = response.data[0]))
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.graph {
  width: 100%;
  display: inline-flex;
  justify-content: center;
}

.where-abouts {
  flex-basis: 50%;
}

.where-sum {
  flex-basis: 50%;
}
</style>

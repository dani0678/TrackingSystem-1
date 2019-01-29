<script>
import { Bar } from 'vue-chartjs'
export default {
  name: 'WhereSum',
  extends: Bar,
  props: ['info'],
  data: () => {
    return {
      placeList:[],
      sumList:[]
    }
  },
  mounted () {
    if(this.info){
      this.makeList()
      this.renderCharts()
    }
  },
  methods: {
    makeList: function(){
      const list = []
      const arraySize = this.info.Location.length-1
      for(let i = arraySize; i > arraySize-400; i-- ){
        list.push(this.info.Location[i].place)
      }
      list.reverse()

      let counts = {};
      for(let i=0; i< list.length; i++) {
        const key = list[i]
        counts[key] = (counts[key])? counts[key] + 1 : 1
      }
      for (let key in counts) {
        this.placeList.push(key)
        this.sumList.push(counts[key])
      }
    },

    renderCharts: function(){
      this.renderChart({
        labels: this.placeList,
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#2E9AFE',
            data: this.sumList
         }
        ]
     },{
         legend: {
            display: false
         },
         responsive: true,
      })
    }
  },
  watch: {
    info: function() {
      this.makeList()
      this.renderCharts()
    }
  }
}
</script>
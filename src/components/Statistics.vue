
<template lang="pug">
.content-wrapper
  section 
    .container
      h1 Statistics
      input.find-date--input(
                  type="date"
                  placeholder="Choose date?"
                  v-model="inputDate"
                )
      .button.button-default(
        @click="dateStatFilter(inputDate), fillData()"
            ) Send
    .stat-list       
      .stat-item(
                v-for="stat in stats"
                :key="stat.id"
              )
        .ui-card
          .task-item__info
            span {{stat.title}}
          .task-item__info
            span {{timeString(stat.time)}}
  section       
    .container
      <div class="small">
        <pie-chart :chart-data="datacollection"></pie-chart>
      </div>

</template>

<script>
  import PieChart from '../store/pieCharts'

  export default {
    components: {
      PieChart
    },
    data () {
      return {
        datacollection: null,
        stats: [],
        inputDate: []
      }
    },
    mounted () {

    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: ['Job', 'Sleep','Fun','Other (With comment)','Eat'],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#000000',
              data: this.statPercent()
            }
          ]
        }
      },
      dateStatFilter (date) {
          let allStat = []
          let dateStat = []   
          let filterStat = []  
          this.statFilter.forEach(function(stat) {
            allStat.push(stat)
        })
        for(let i=0 ; i < allStat.length ; i++){
        let newDate = this.dateArray(new Date((allStat[i].completeDate)).toISOString())
        dateStat.push(newDate)
        }
        for(let i=0 ; i < allStat.length ; i++) {
          if(dateStat[i] == date) {
            filterStat.push(allStat[i])
          }
        }
        if(date == 0) {    
         this.stats = allStat
        } else {
        this.stats = filterStat
        }
        console.log(date == 0)
        },
      dateArray(dates) {
      dates = dates.toString().split('/\s*-\s*/').toString().substr(0,10)
      return dates
      },
      inputArray(str) {
      str = str.toString().split('/\s*-\s*/').toString()
      return str
      },
      statPercent () {
      let jobCounter = 0
      let sleepCounter = 0
      let funCounter = 0
      let otherCounter = 0
      let eatCounter = 0
      let allTime = 0
      let stats = this.stats
      
      for(let i= 0; i< stats.length; i++ ){
      if (stats[i].tagUsed == 'Job') {
        jobCounter += stats[i].time

      } else if(stats[i].tagUsed == 'Sleep') {
        sleepCounter += stats[i].time

      } else if(stats[i].tagUsed == 'Fun') {
        funCounter += stats[i].time

      } else if(stats[i].tagUsed == 'Other (With comment)') {
        otherCounter += stats[i].time

      } else {
        eatCounter += stats[i].time
      }
        let timeStat = stats[i].time
        allTime += timeStat
      }
      jobCounter = this.persentCounter(jobCounter,allTime)
      sleepCounter = this.persentCounter(sleepCounter,allTime)
      funCounter = this.persentCounter(funCounter,allTime)
      otherCounter = this.persentCounter(otherCounter,allTime)
      eatCounter = this.persentCounter(eatCounter,allTime)
      console.log([jobCounter,sleepCounter,funCounter,otherCounter,eatCounter])
      return [jobCounter,sleepCounter,funCounter,otherCounter,eatCounter]
    },
    persentCounter(slice, all){
        let count = 0
        count = (slice*100) / all
        return count
      },
    timeString(time){
      let options = {
          minute: 'numeric',
          second: 'numeric'
        };
      time = new Date(time)
      return time.toLocaleString("ru", options)
    },
    nowTime () {
      let date = new Date();
      return date.getTime()
    },
      dateString(date){
      let options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        };
        date = new Date(date)
      return date.toLocaleString(options)
    },
    timeString(time){
      let options = {
          minute: 'numeric',
          second: 'numeric'
        };
      time = new Date(time)
      return time.toLocaleString("ru", options)
    }
    },
  computed: {
      statFilter () {
        return this.$store.getters.stats 
      }
    }
  }
    
</script>


<style lang="stylus" scoped>

h1 {
  font-family: 'Helvetica', Arial;
  color: #464646;
  text-transform: uppercase;
  padding-bottom: 15px;
  font-size: 28px;
  margin-top: 0;
}
.small {
    max-width: 600px;
    margin:  50px auto;
  }
.button {
  margin-left: 3%
}
.find-date--input {
  margin-top: 1%
}
.task-item__info {
  display flex
  justify-content space-between
  align-items center
  margin-bottom 20px
}

</style>






        
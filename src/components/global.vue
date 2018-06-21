<script>
import GameApi from '@/Api/index.js'
let shareCode
const uniqueId = 'xxx1234'

GameApi.getUserInfo({uniqueId: 'xxx1234'}).then((data) => {
  console.log(data.data.data.invitationCode)
  shareCode = data.data.data.invitationCode
})

export default {
  uniqueId,
  shareCode
}
</script>

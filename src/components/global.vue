<script>
import GameApi from '@/Api/index.js'
let shareCode
let UserInfo
const uniqueId = 'xxx1234'

GameApi.getUserInfo({uniqueId: 'xxx1234'}).then((data) => {
  console.log(data.data.data.invitationCode)
  UserInfo = data.data.data
  shareCode = data.data.data.invitationCode
})

export default {
  uniqueId,
  shareCode,
  UserInfo
}
</script>

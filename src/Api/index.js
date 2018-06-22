import instance from '../utils/axios'

function getUserInfo (data) {
  return instance.get('/user/info', {
    params: data
  })
}

function getMainInfo (data) {
  return instance.get('/webcast/info', {
    params: data
  })
}

function getMybonus (data) {
  return instance.get('/bonus/info', {
    params: data
  })
}

function sendInviteCode (data) {
  return instance.post('/user/invitationCode', data)
}

function entranceDetail (data) {
  return instance.get('/webcast/entrance', {
    params: data
  })
}

function fetchQuestion (data) {
  return instance.get('/webcast/question/next', {
    params: data
  })
}

function getAnswer (data) {
  return instance.post('/webcast/question/answer', data)
}
export default {
  getUserInfo,
  getMybonus,
  sendInviteCode,
  entranceDetail,
  fetchQuestion,
  getAnswer,
  getMainInfo
}

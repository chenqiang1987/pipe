export const afterCurrentTime = value => {
    let now = new Date().valueOf();
    let time = new Date(value).valueOf();
    if (time > now) {
      return true;
    } else {
      return false;
    }
}

export const parser = num => {
  if (num < 10) {
      return '0' + num
  }
  return num
}



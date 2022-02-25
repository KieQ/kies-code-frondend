export function file_size_format(size){
    let gb = Math.floor(size/1024/1024/1024);
    let mb = Math.floor(size/1024/1024%1024);
    let kb = Math.floor(size/1024%1024);
    let b = Math.floor(size%1024);
    let ret = "";
    if(gb !== 0){
        ret = `${gb}.${mb} GB`;
    }else if(mb !== 0){
        ret = `${mb}.${kb} MB`;
    }else if(kb !== 0){
        ret = `${kb}.${b} KB`;
    }else{
        ret = `${b} B`;
    }
    return ret;
}

export function download_speed_format(size){
    let gb = Math.floor(size/1024/1024/1024);
    let mb = Math.floor(size/1024/1024%1024);
    let kb = Math.floor(size/1024%1024);
    let b = Math.floor(size%1024);
    let ret = "";
    if(gb !== 0){
        ret = `${gb}.${mb} GB/s`;
    }else if(mb !== 0){
        ret = `${mb}.${kb} MB/s`;
    }else if(kb !== 0){
        ret = `${kb}.${b} KB/s`;
    }else{
        ret = `${b} B/s`;
    }
    return ret;
}
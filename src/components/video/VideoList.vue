<template>
  <div>
    <div class="row" v-show="showAlert">
      <div class="alert" :class="alert_type" id="errorBox" role="alert"></div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-4">
          <input id="profile" type="text" class="mx-auto" placeholder="电影封面链接">
        </div>
        <div class="col-4">
          <input type="text" class="mx-1" id="magnet" placeholder="磁力链接" />
          <button
            class="btn btn-outline-dark shadow-none my-auto mx-1 btn-sm"
            @click="download_with_magnet"
          >
            下载
          </button>
        </div>
        <div class="col-4">
          <div class="custom-file">
            <label id="file_name" class="mx-1">种子文件</label>
          <button class="btn btn-primary shadow-none my-auto btn-sm mx-1" onclick="document.getElementById('torrent').click()">选择</button>
          <input type='file' id="torrent" style="display:none" @change="setFileName"> 
            <button
              class="btn btn-outline-dark shadow-none my-auto mx-1 btn-sm"
              @click="download_with_torrent"
            >
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
    <ul class="list-group w-75 mx-auto">
      <li class="list-group-item" v-for="(item, i) in items" :key="i">
        <div class="container mx-auto">
          <div class="row">
            <div class="col-3 d-none d-lg-block">
              <img :src="item.profile" :alt="item.name" class="profile_img" />
            </div>
            <div class="col my-auto w-80 float-left">
              <h5>
                {{ item.name }}
              </h5>
              <ul class="list-unstyled">
                <li>文件大小: {{ fileSize.get(item.hash_key) || "0 B" }}</li>
                <li v-if="!item.can_display">
                  <div>
                    下载速度:{{ currentSpeed.get(item.hash_key) || "0 B/s" }}
                  </div>
                  <div class="progress">
                    <div
                      :id="'progress_' + item.hash_key"
                      class="
                        progress-bar progress-bar-striped progress-bar-animated
                      "
                      role="progressbar"
                      style="width: 0%"
                    ></div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="col-2 my-auto d-flex justify-content-end">
              <div class="d-block">
                <button
                  type="button"
                  class="d-block btn btn-outline-primary my-1 shadow-none"
                  @click="
                    item.can_display
                      ? play(item.name)
                      : download_with_hash(item.hash_key)
                  "
                >
                  {{ item.can_display ? "播放" : "下载" }}
                </button>
                <button
                  type="button"
                  class="d-block btn btn-outline-danger my-1 shadow-none"
                  @click="remove(item.hash_key)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { file_size_format, download_speed_format } from "../../utils/utils.js";

var progress_ids = [];
var api = "/api";

export default {
  data() {
    return {
      items: [],
      currentSpeed: new Map(),
      fileSize: new Map(),
      alert_type: "alert-info",
      showAlert: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(async (that) => {
      for (let item of progress_ids) {
        clearInterval(item);
      }
      progress_ids = [];
      await that.getList();
      for (let item of that.items) {
        that.updateProgress(item.hash_key);
      }
    });
  },

  methods: {
    async getList() {
      let resp = await fetch(`${api}/video/list`);
      let content = await resp.json();
      this.items = content.data;
    },

    updateProgress(key) {
      progress_ids.push(
        setInterval(async () => {
          let resp = await fetch(`${api}/video/progress?key=${key}`);
          let content = await resp.json();
          if (content !== undefined && content.status_code === 0) {
            this.update_progress_bar(key, content.data.progress);
            this.currentSpeed.set(key, this.format_speed(content.data.speed));
            this.fileSize.set(key, this.format_file(content.data.file_size));
          }
        }, 1000)
      );
    },

    format_file(fmt) {
      return file_size_format(fmt);
    },
    format_speed(speed) {
      return download_speed_format(speed);
    },

    play(name) {
      console.log(encodeURIComponent(name));
      window.location.href = `/media/${encodeURIComponent(name)}`
    },
    async download_with_hash(key) {
      let resp = await fetch(`${api}/video/add?type=hash`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          hash: key,
        }),
      });

      let result = await resp.json();
      if (result !== null && result.status_code === 0) {
        this.showBox("下载任务已经提交成功", "alert-info", 0);
      } else {
        this.showBox("下载任务创建失败，请重试", "alert-danger", 0);
      }
    },
    async download_with_torrent() {
      let files = document.getElementById("torrent").files;
      if(files.length <= 0){
        this.showBox("无法获取种子文件","alert-danger", 0);
        return;
      }

      let profile = document.getElementById("profile").value;
      if(profile === null || profile===""){
        this.showBox("请输入合法的图片链接", "alert-danger", 10);
        return;
      }

      let data = new FormData();
      data.append("file", files[0]);
      data.append("profile_link", profile);

      let resp = await fetch(`${api}/video/add?type=torrent`,{
        method:'POST',
        body: data
      });
      let content = await resp.json();
      if(content !== null && content.status_code ===0){
        this.showBox("下载任务已经提交成功", "alert-info", 0);
        await this.getList();
      }else {
        this.showBox("下载任务创建失败，请重试", "alert-danger", 0);
      }

    },
    async download_with_magnet() {
      let magnet_link = document.getElementById("magnet").value;
      if(magnet_link === null || magnet_link===""){
        this.showBox("请输入合法的磁力链接", "alert-danger", 10);
        return;
      }

      let profile = document.getElementById("profile").value;
      if(profile === null || profile===""){
        this.showBox("请输入合法的图片链接", "alert-danger", 10);
        return;
      }

      let resp = await fetch(`${api}/video/add?type=magnet`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          "magnet_link": magnet_link,
          "profile_link": profile,
        }),
      });

      let result = await resp.json();
      if (result !== null && result.status_code === 0) {
        this.showBox("下载任务已经提交成功", "alert-info", 0);
        await this.getList();
      } else {
        this.showBox("下载任务创建失败，请重试", "alert-danger", 0);
      }
    },
    async remove(key) {
      console.log("hello");
      let resp = await fetch(`http://localhost:8082/video/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          key: key,
        }),
      });
      let result = await resp.json();
      console.log(result);
      if (result !== null && result.status_code === 0) {
        this.showBox("删除成功", "alert-info", 10);
        location.reload();
      } else {
        this.showBox("删除失败，请重试", "alert-danger", 0);
      }
    },
    setFileName(){
      let file = document.getElementById("torrent").files[0].name;
      document.getElementById("file_name").innerText = file;
    },
    update_progress_bar(key, value) {
      let progress_bar = document.getElementById(`progress_${key}`);
      if (progress_bar !== null) {
        progress_bar.style.width = `${Math.floor(value * 100)}%`;
      }
    },
    showBox(text, alertType, timeout = 5) {
      this.alert_type = alertType;
      clearTimeout(this.timeout);
      document.getElementById("errorBox").innerText = text;
      this.showAlert = true;
      if (timeout > 0) {
        this.timeout = setTimeout(() => {
          this.showAlert = false;
        }, timeout * 1000);
      }
    },
  },
};
</script>

<style scope>
.profile_img {
  width: 150px;
  height: auto;
}
</style>
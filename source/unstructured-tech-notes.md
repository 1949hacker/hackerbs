以下是乱七八糟的各种没时间整理的随手技术笔记，你可以通过页面搜索关键词查询可能是你用得上的东西，也可以通过底部联系方式询问我。

## CentOS 7 批量给 eth0 网卡添加 IP

```bash
# 通过变量d实现改一个128使所有D段地址同步修改
d=128 && echo -e "IPADDR2=43.225.58.$d\nPREFIX2=27\nIPADDR3=69.165.77.$d\nPREFIX3=27\nIPADDR4=103.42.29.$d \nPREFIX4=27\nIPADDR5=220.158.194.$d \nPREFIX5=27\nIPADDR6=220.158.195.$d \nPREFIX6=27\nIPADDR7=107.151.236.$d \nPREFIX7=27\nIPADDR8=107.151.237.$d \nPREFIX8=27\nIPADDR9=198.44.163.$d \nPREFIX9=27\n" >> /etc/sysconfig/network-scripts/ifcfg-eth0 && systemctl restart network
```

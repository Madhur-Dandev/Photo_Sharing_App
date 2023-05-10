import React, {useState, useMemo} from "react";
import ImgGridCol from "./ImgGridCol";
import rImg1 from "/images/recommended1.jpg";
import rImg2 from "/images/recommended2.jpg";
import rImg3 from "/images/recommended3.jpg";
import rImg4 from "/images/recommended4.jpg";
import rImg5 from "/images/recommended5.jpg";
import rImg6 from "/images/recommended6.jpg";
import rImg7 from "/images/recommended7.jpg";
import rImg8 from "/images/recommended8.jpg";
import rImg9 from "/images/recommended9.jpg";
import rImg10 from "/images/recommended10.jpg";
import rImg11 from "/images/recommended11.jpg";
import rImg12 from "/images/recommended12.jpg";

const ImgGrid = ({showUserInfo}) => {
  
  const TEMPIMGSINFO = [
    {
      id: 1,
      user_name: "Madhur Dandev",
      user_avatar:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OyfD4XonoalTInNN_EU19QHaHa%26pid%3DApi&f=1&ipt=cfaa12adff3349daa78a4e46287bcabb40e96ef8034b139204c169f5f2596d78&ipo=images",
      img: rImg1,
    },
    {
      id: 2,
      user_name: "Deep Manmode",
      user_avatar:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ%26pid%3DApi&f=1&ipt=351603fdac2ecb02cc96aff8eb40523f28240d75697c8c07c909fa4ea8efb9ff&ipo=images",
      img: rImg2,
    },
    {
      id: 3,
      user_name: "Hatim Bohra",
      user_avatar:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.6O5I1yvKhCc8911FuaRoKQHaHa%26pid%3DApi&f=1&ipt=b58766ad0e83f2598c3ad8b74d00d1659b04df24cb3f1d89281c6a8d5ac64230&ipo=images",
      img: rImg3,
    },
    {
      id: 4,
      user_name: "Rohit Gakhare",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.8F97-4tTe0kDw2M0XktW8gHaHZ%26pid%3DApi&f=1&ipt=976548e71a8e2c0f180794403b84cdc99fddc579ec28b96e5a195e546c4de1ce&ipo=images",
      img: rImg4,
    },
    {
      id: 5,
      user_name: "Saurav Chafle",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.9khtmooKvy2vTJwoG4jRUAHaHP%26pid%3DApi&f=1&ipt=cbdc9f73b11ea3ac102a1e45a79f1399ac0e506855818c2e1a65fd80dba6475d&ipo=images",
      img: rImg5,
    },
    {
      id: 6,
      user_name: "Gaurav Chafle",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.6L9jE3aVWU1ivXdPG7PNjAHaHR%26pid%3DApi&f=1&ipt=712d36b0418b7e468cc6fd75aa58e5879558b8859c4cad3a526805315a8925f7&ipo=images",
      img: rImg6,
    },
    {
      id: 7,
      user_name: "Madhur Dandev",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ%26pid%3DApi&f=1&ipt=351603fdac2ecb02cc96aff8eb40523f28240d75697c8c07c909fa4ea8efb9ff&ipo=images",
      img: rImg7,
    },
    {
      id: 8,
      user_name: "Madhur Dandev",
      user_avatar:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ%26pid%3DApi&f=1&ipt=351603fdac2ecb02cc96aff8eb40523f28240d75697c8c07c909fa4ea8efb9ff&ipo=images",
      img: rImg8,
    },
    {
      id: 9,
      user_name: "Madhur Dandev",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ%26pid%3DApi&f=1&ipt=351603fdac2ecb02cc96aff8eb40523f28240d75697c8c07c909fa4ea8efb9ff&ipo=images",
      img: rImg9,
    },
    {
      id: 10,
      user_name: "Madhur Dandev",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ%26pid%3DApi&f=1&ipt=351603fdac2ecb02cc96aff8eb40523f28240d75697c8c07c909fa4ea8efb9ff&ipo=images",
      img: rImg10,
    },
    {
      id: 11,
      user_name: "Madhur Dandev",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ%26pid%3DApi&f=1&ipt=351603fdac2ecb02cc96aff8eb40523f28240d75697c8c07c909fa4ea8efb9ff&ipo=images",
      img: rImg11,
    },
    {
      id: 12,
      user_name: "Madhur Dandev",
      user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ%26pid%3DApi&f=1&ipt=351603fdac2ecb02cc96aff8eb40523f28240d75697c8c07c909fa4ea8efb9ff&ipo=images",
      img: rImg12,
    },
  ];
    const [colItem, setColItem] = useState([]);
    const divider = (num) => {
      /**
       * This function will divide the result into specific numbers of column
       */
      let returnArr = [];
      if (num > 0) {
        const ipc = TEMPIMGSINFO.length / num; // item per column
        for (let i = 0; i < num; i++) {
          returnArr.push(TEMPIMGSINFO.splice(0, ipc));
        }
        if (TEMPIMGSINFO.length) {
          returnArr[num - 1].push(TEMPIMGSINFO.splice(0));
        }
        // console.log(returnArr);
      }
      return returnArr;
    };
  
    useMemo(() => {
      setColItem(divider(3));
    }, []);
  return <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {colItem.map((col, index) => (
    <ImgGridCol items={col} key={index} showUserInfo={showUserInfo} />
  ))}
</div>;
};

export default ImgGrid;
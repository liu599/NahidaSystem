import {useEffect} from "react";
import {getTaggingSetting} from "@/pages/TaggingSetting/api.ts";

export default () => {
  useEffect(() => {
    getTaggingSetting({}, 1, 20)
  }, []);
  return (
    <div>Tagging Setting</div>
  )
}

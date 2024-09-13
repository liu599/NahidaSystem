import {useEffect} from "react";
import {getTaggingSetting} from "@/pages/TaggingSetting/api.ts";

export default () => {
  useEffect(() => {
    getTaggingSetting({
      sourceType: 'tagging',
      filter: {},
      pager: {
        pageNumber: 1,
        pageSize: 20
      }
    })
  }, []);
  return (
    <div>Tagging Setting</div>
  )
}
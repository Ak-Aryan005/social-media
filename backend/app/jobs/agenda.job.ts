import {agenda} from '../config/agenda'
import Agenda, { Job } from "agenda";
import { deletePost } from '../modules/post/services/post.service';
interface DeletePostJobData {
  storyId: string;
  // postId: string;
}

agenda.define("deletePostJob", async (job: Job<DeletePostJobData>) => {
  // const { postId } = job.attrs.data;

  // console.log("Running delete job for post:", postId);
  // await deletePost(postId);
  console.log("akm")
});





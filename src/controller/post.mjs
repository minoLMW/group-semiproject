import * as postRepository from "../data/post.mjs";

// 모든 포스트 / 해당 아이디에 대한 포스트를 가져오는 함수
// query : key=value값
export async function getPosts(req, res, next) {
  const userid = req.user;
  const data = await (userid
    ? postRepository.getAllByUserid(userid)
    : postRepository.getAll());
  res.status(200).json(data);
}

// id를 받아 하나의 포스트를 가져오는 함수
export async function getPostId(req, res, next) {
  const id = req.user;
  const data = await postRepository.getById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.staus(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
}

// 포스트를 생성하는 함수
export async function createPost(req, res, next) {
  const { text, title } = req.body;
  const posts = await postRepository.create(text, title, req.user);
  res.status(201).json(posts);
}

// 포스트 수정하는 함수
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const title = req.body.title;
  const post = await postRepository.getById(id);
  if (!post) {
    return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
  }
  if (post.useridx !== req.user.id) {
    return res.sendStatus(403);
  }
  const updated = await postRepository.update(id, text, title);
  res.status(200).json(updated);
}

// 포스트 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  const post = await postRepository.getById(id);
  if (!post) {
    return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
  }
  if (post.useridx !== req.user.id) {
    return res.sendStatus(403);
  }
  await postRepository.remove(id);
  res.sendStatus(204);
}

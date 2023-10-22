import { gql } from "../../deps.ts";

export const scan = gql`
  query scan($src: String!, $image: String!, $failOn: String!) {
    scan(src: $src, image: $image, failOn: $failOn)
  }
`;

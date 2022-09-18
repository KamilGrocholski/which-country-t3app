// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import getRandomIds from "../../server/utils/getRandomIds";
import { prisma } from "../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  const nCountries = await prisma.country.count()
  const twoRandomIds = getRandomIds(1, nCountries)
  const pair = await prisma.country.findMany({
    where: {
      id: { in: twoRandomIds }
    }
  })
  return { firstCountry: pair[0], secondCountry: pair[1] }

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};

export default restricted;

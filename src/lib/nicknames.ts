const ADJECTIVES = [
  '졸린', '신나는', '배고픈', '용감한', '느긋한',
  '활기찬', '반짝이는', '포근한', '씩씩한', '귀여운',
  '부지런한', '행복한', '따뜻한', '상큼한', '당당한',
  '멋진', '유쾌한', '차분한', '재빠른', '든든한',
]

const ANIMALS = [
  '고양이', '강아지', '토끼', '판다', '펭귄',
  '수달', '다람쥐', '햄스터', '여우', '코알라',
  '곰돌이', '오리', '거북이', '카피바라', '미어캣',
  '알파카', '치타', '부엉이', '돌고래', '레서판다',
]

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return `${adj} ${animal}`
}

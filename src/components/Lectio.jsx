import React, { useEffect, useMemo, useState } from "react";
import { useUserState } from "../state/UserStateContext";
import { makeLectioItemResult } from "../state/schema";
import { PaperGrain } from "./PaperGrain";
import { SectionMark } from "./SectionMark";

// 원본 lectio-final.jsx의 ITEMS/CSS/흐름을 그대로 유지하되,
// 결과를 컴포넌트 로컬 state에만 두지 않고 공통 User State(schema.js의 Lectio Object)로 저장하도록 바꿨다.
// 저장 형태를 topAxis 태그 나열에서 Open / Closed / Closing Logic / Opening Condition으로 바꾼 것이 이번 변경의 핵심.

const ITEMS = [
  {
    id: 1,
    label: "오래된 사람의 부탁을\n거절하는 것",
    plain: "오래된 사람의 부탁을 거절하는 것",
    q3: [
      { text: "거절하면 그 사람이 서운해할 거야.", axis: "relationship" },
      { text: "한 번 거절하면 관계가 달라져.", axis: "relationship" },
      { text: "도와줄 수 있는데 안 하는 건 아니지.", axis: "responsibility" },
      { text: "그런 사람으로 보이고 싶지 않아.", axis: "evaluation" },
    ],
    q4: [
      { q: "무엇이 가장 마음에 걸리나요?", opts: ["미안한 마음", "그 사람이 서운했을 거란 생각", "내가 매정했다는 느낌", "잘 모르겠다"] },
      { q: "관계가 달라진다는 건, 무엇이 달라질까 걱정되나요?", opts: ["다시 부탁하기 어려워질 것", "서로 어색해질 것", "믿음이 줄어들 것", "잘 모르겠다"] },
      { q: "무엇을 외면하는 것처럼 느껴지나요?", opts: ["그 사람의 어려움", "그 사람과의 관계", "도울 수 있었다는 사실 자체", "잘 모르겠다"] },
      { q: "가장 되고 싶지 않은 모습은 무엇인가요?", opts: ["매정한 사람", "계산적인 사람", "이기적인 사람", "잘 모르겠다"] },
    ],
  },
  {
    id: 2,
    label: "불편했던 걸\n그 사람에게 말하는 것",
    plain: "불편했던 걸 그 사람에게 말하는 것",
    q3: [
      { text: "예민하다는 말 들을 거야.", axis: "evaluation" },
      { text: "그 정도로 분위기 망칠 필요 있나.", axis: "relationship" },
      { text: "말해도 달라질지 모르겠어.", axis: "uncertainty" },
      { text: "괜히 문제 만드는 사람 되기 싫어.", axis: "evaluation" },
    ],
    q4: [
      { q: "어떤 모습으로 비칠까 걱정되나요?", opts: ["별거 아닌 일에 반응하는 사람", "감정적인 사람", "까다로운 사람", "잘 모르겠다"] },
      { q: "무엇이 망가질까 걱정되나요?", opts: ["편안한 분위기", "그 사람과의 사이", "그 자리의 흐름", "잘 모르겠다"] },
      { q: "무엇이 안 달라질 것 같나요?", opts: ["상대의 행동", "그 사람의 태도", "상황 자체", "잘 모르겠다"] },
      { q: "어떤 사람으로 보이고 싶지 않나요?", opts: ["문제를 만드는 사람", "예민한 사람", "관계를 어렵게 만드는 사람", "잘 모르겠다"] },
    ],
  },
  {
    id: 3,
    label: "잘한 일을\n내가 잘했다고 말하는 것",
    plain: "잘한 일을 내가 잘했다고 말하는 것",
    q3: [
      { text: "혼자 한 일도 아닌데.", axis: "responsibility" },
      { text: "내가 잘했다고 할 만큼 대단한 건 아니야.", axis: "self_permission" },
      { text: "잘난 척하는 걸로 보여.", axis: "evaluation" },
      { text: "다음에 못 하면 더 민망해.", axis: "uncertainty" },
    ],
    q4: [
      { q: "누구와 나눈 일이라고 느끼나요?", opts: ["함께한 사람들", "도와준 사람", "운이나 상황", "잘 모르겠다"] },
      { q: "무엇이 있어야 내가 잘했다고 말해도 된다고 느끼나요?", opts: ["더 큰 성과", "다른 사람도 인정하는 것", "내가 세운 기준을 넘는 것", "잘 모르겠다"] },
      { q: "어떻게 보일까 걱정되나요?", opts: ["잘난 척하는 사람", "과시하는 사람", "우쭐대는 사람", "잘 모르겠다"] },
      { q: "다음에 무엇을 걱정하나요?", opts: ["기대에 못 미치는 것", "실망시키는 것", "말이 부풀려졌다는 느낌", "잘 모르겠다"] },
    ],
  },
  {
    id: 4,
    label: "칭찬을 그냥\n고맙다고 받는 것",
    plain: "칭찬을 그냥 고맙다고 받는 것",
    q3: [
      { text: "아니라고 해야 예의인 것 같아.", axis: "self_permission" },
      { text: "그대로 받으면 우쭐한 사람 같아.", axis: "evaluation" },
      { text: "정말 그렇게 생각해서 하는 말일까.", axis: "uncertainty" },
      { text: "받아버리면 다음에 부담돼.", axis: "uncertainty" },
    ],
    q4: [
      { q: "무엇이 예의라고 느껴지나요?", opts: ["겸손하게 말하는 것", "낮추어 말하는 것", "부풀리지 않는 것", "잘 모르겠다"] },
      { q: "우쭐한 사람은 어떤 모습인가요?", opts: ["자기를 내세우는 사람", "칭찬을 당연하게 받는 사람", "겸손하지 않은 사람", "잘 모르겠다"] },
      { q: "어떤 부분이 의심스럽게 느껴지나요?", opts: ["표정이나 말투", "그 사람과의 평소 관계", "칭찬받을 만한 일인지 스스로 의심돼서", "잘 모르겠다"] },
      { q: "다음에 무엇이 부담되나요?", opts: ["또 잘해야 한다는 것", "기대에 맞춰야 하는 것", "이번만큼 못할 수도 있다는 것", "잘 모르겠다"] },
    ],
  },
  {
    id: 5,
    label: "모른다고\n말하는 것",
    plain: "모른다고 말하는 것",
    q3: [
      { text: "모른다고 하면 무시당해.", axis: "evaluation" },
      { text: "이 정도는 알아야 하는 거 아닌가.", axis: "self_permission" },
      { text: "이 정도는 혼자 찾아봐야 하는 거 아닌가.", axis: "responsibility" },
      { text: "물어보면 준비 안 한 사람처럼 보여.", axis: "evaluation" },
    ],
    q4: [
      { q: "무시당한다는 건, 어떤 취급을 걱정하나요?", opts: ["가볍게 여겨지는 것", "능력을 의심받는 것", "낮춰 보는 시선", "잘 모르겠다"] },
      { q: "누구 기준으로 이 정도는 알아야 한다고 느끼나요?", opts: ["내 스스로의 기준", "이 자리에 있는 사람들 기준", "막연한 사회적 기준", "잘 모르겠다"] },
      { q: "혼자 찾아보는 게 왜 더 낫다고 느끼나요?", opts: ["폐를 안 끼쳐서", "스스로 해결하는 게 맞아서", "물어보는 게 번거로워서", "잘 모르겠다"] },
      { q: "어떤 모습으로 보일까 걱정되나요?", opts: ["준비 안 한 사람", "무능한 사람", "믿음이 덜 가는 사람", "잘 모르겠다"] },
    ],
  },
  {
    id: 6,
    label: "도와달라고\n먼저 말하는 것",
    plain: "도와달라고 먼저 말하는 것",
    q3: [
      { text: "폐 끼치는 것 같아.", axis: "self_permission" },
      { text: "혼자 할 수 있어야 하는 거 아닌가.", axis: "responsibility" },
      { text: "부탁하면 빚지는 기분이야.", axis: "relationship" },
      { text: "거절당하면 더 힘들어.", axis: "uncertainty" },
    ],
    q4: [
      { q: "무엇이 폐라고 느껴지나요?", opts: ["상대의 시간을 뺏는 것", "번거롭게 만드는 것", "짐이 되는 것", "잘 모르겠다"] },
      { q: "왜 혼자 해야 한다고 느끼나요?", opts: ["원래 그래야 할 것 같아서", "부탁하면 약해 보일까 봐", "다들 그렇게 하니까", "잘 모르겠다"] },
      { q: "빚지는 느낌은 무엇을 갚아야 한다는 걸까요?", opts: ["똑같은 도움", "더 큰 도움", "언젠가 갚아야 할 마음의 빚", "잘 모르겠다"] },
      { q: "거절당하면 무엇이 힘들 것 같나요?", opts: ["부탁한 게 후회되는 것", "관계가 어색해지는 것", "다시 부탁 못 할 것 같은 느낌", "잘 모르겠다"] },
    ],
  },
  {
    id: 7,
    label: "잘 모르는 사람에게\n먼저 말 거는 것",
    plain: "잘 모르는 사람에게 먼저 말 거는 것",
    q3: [
      { text: "괜히 어색해지면 어떡해.", axis: "uncertainty" },
      { text: "상대가 안 반가워하면 민망해.", axis: "evaluation" },
      { text: "먼저 다가가는 사람으로 보이기 싫어.", axis: "evaluation" },
      { text: "굳이 내가 먼저 할 일은 아니잖아.", axis: "responsibility" },
    ],
    q4: [
      { q: "무엇이 어색해질 것 같나요?", opts: ["분위기", "그 사람과의 거리감", "내가 느낄 민망함", "잘 모르겠다"] },
      { q: "반가워하지 않으면 무엇이 민망한가요?", opts: ["괜히 말 걸었다는 느낌", "무안해지는 것", "혼자 나선 것 같은 느낌", "잘 모르겠다"] },
      { q: "어떤 모습으로 보이기 싫은가요?", opts: ["나서는 사람", "가벼운 사람", "아무에게나 다가가는 사람", "잘 모르겠다"] },
      { q: "왜 내가 먼저 할 필요는 없다고 느끼나요?", opts: ["상대가 먼저 해도 되니까", "굳이 나일 필요는 없어서", "가만히 있어도 되니까", "잘 모르겠다"] },
    ],
  },
  {
    id: 8,
    label: "하고 싶은 일을\n먼저 제안하는 것",
    plain: "하고 싶은 일을 먼저 제안하는 것",
    q3: [
      { text: "나서는 사람으로 보여.", axis: "evaluation" },
      { text: "거절당하면 민망해.", axis: "uncertainty" },
      { text: "내가 제안하면 내가 다 해야 해.", axis: "responsibility" },
      { text: "다들 별로 안 내켜 하면 어떡해.", axis: "relationship" },
    ],
    q4: [
      { q: "어떤 모습으로 비칠까 걱정되나요?", opts: ["주도하려는 사람", "튀는 사람", "고집 있는 사람", "잘 모르겠다"] },
      { q: "거절당하면 무엇이 민망한가요?", opts: ["괜히 말 꺼낸 것", "혼자 좋아한 것 같은 느낌", "분위기가 싸해지는 것", "잘 모르겠다"] },
      { q: "왜 내가 다 해야 한다고 느끼나요?", opts: ["제안한 사람이 책임져야 할 것 같아서", "다들 나만 볼 것 같아서", "시작한 사람이 끝내야 할 것 같아서", "잘 모르겠다"] },
      { q: "다들 안 내켜 하면 무엇이 걱정되나요?", opts: ["내 제안이 무시당한 느낌", "괜히 나선 것 같은 느낌", "다음에 다시 말 꺼내기 어려워지는 것", "잘 모르겠다"] },
    ],
  },
  {
    id: 9,
    label: "나를 위해\n부담되는 돈을 쓰는 것",
    plain: "나를 위해 부담되는 돈을 쓰는 것",
    q3: [
      { text: "나한테 그만큼 쓸 일은 아니야.", axis: "self_permission" },
      { text: "그 돈을 쓰면 다른 데 쓸 기회를 놓치잖아.", axis: "loss" },
      { text: "내가 그럴 자격이 있나 싶어.", axis: "self_permission" },
      { text: "지금 쓰면 나중에 아쉬워.", axis: "uncertainty" },
    ],
    q4: [
      { q: "무엇 때문에 그 정도는 아니라고 느끼나요?", opts: ["나에게 필요한 정도", "내가 평소 쓰는 수준", "남들이 보기에 적당한 정도", "잘 모르겠다"] },
      { q: "그 돈을 쓰면 무엇을 놓치는 것 같나요?", opts: ["다른 사람을 위한 것", "앞으로를 위한 여유", "더 필요한 데 쓸 기회", "잘 모르겠다"] },
      { q: "무엇이 있어야 '이 정도는 써도 된다'고 느낄까요?", opts: ["내가 그만큼 해냈다는 확인", "남들도 그렇게 쓴다는 사실", "그럴 자격을 증명한 순간", "잘 모르겠다"] },
      { q: "어떤 아쉬움을 걱정하나요?", opts: ["돈이 부족해질까 봐", "더 필요할 때를 대비 못 할까 봐", "후회할까 봐", "잘 모르겠다"] },
    ],
  },
  {
    id: 10,
    label: "큰돈을 쓰는\n결정을 하는 것",
    plain: "큰돈을 쓰는 결정을 하는 것",
    q3: [
      { text: "잘못되면 돌이킬 수가 없어.", axis: "loss" },
      { text: "그만한 돈을 걸 만큼 확실하지 않아.", axis: "uncertainty" },
      { text: "실패하면 지금 있는 것까지 잃어.", axis: "loss" },
      { text: "나는 그런 거 하는 사람이 아니야.", axis: "self_permission" },
    ],
    q4: [
      { q: "무엇이 다시 안 돌아온다고 느끼나요?", opts: ["그 돈 자체", "지금까지의 안정", "다시 도전할 기회", "잘 모르겠다"] },
      { q: "무엇이 더 확인되어야 하나요?", opts: ["성공 가능성", "다른 사람들의 사례", "내가 감당할 수 있는지", "잘 모르겠다"] },
      { q: "무엇을 지키고 싶은 걸까요?", opts: ["지금의 안정", "최소한의 여유", "가족이나 주변에 대한 책임", "잘 모르겠다"] },
      { q: "어떤 선택은 원래 내 방식이 아니라고 느끼나요?", opts: ["큰 위험이 따르는 선택", "확신 없이 뛰어드는 선택", "되돌리기 어려운 선택", "잘 모르겠다"] },
    ],
  },
  {
    id: 11,
    label: "일한 대가로\n임금을 먼저 말하는 것",
    plain: "일한 대가로 임금을 먼저 말하는 것",
    q3: [
      { text: "돈 얘기 꺼내면 사람이 달라 보여.", axis: "evaluation" },
      { text: "먼저 말하면 계산적으로 보여.", axis: "evaluation" },
      { text: "알아서 해주겠지 싶어.", axis: "relationship" },
      { text: "그런 말 하기가 민망해.", axis: "self_permission" },
    ],
    q4: [
      { q: "어떤 모습으로 비칠까 걱정되나요?", opts: ["돈만 밝히는 사람", "관계보다 돈을 앞세우는 사람", "예전과 다른 사람", "잘 모르겠다"] },
      { q: "무엇이 계산적으로 읽힐까 걱정되나요?", opts: ["값을 먼저 말하는 것 자체", "정확한 금액을 정해두는 것", "조건을 따지는 태도", "잘 모르겠다"] },
      { q: "상대가 무엇을 해주길 기대하고 있나요?", opts: ["적당한 판단", "나에 대한 배려", "공정한 처리", "잘 모르겠다"] },
      { q: "무엇이 민망하게 느껴지나요?", opts: ["내 값을 스스로 말하는 것", "거절당할 가능성", "사이가 어색해지는 것", "잘 모르겠다"] },
    ],
  },
  {
    id: 12,
    label: "오래 머문 자리를\n떠나는 것",
    plain: "오래 머문 자리를 떠나는 것",
    q3: [
      { text: "여기까지 온 게 아까워.", axis: "loss" },
      { text: "지금까지 쌓은 걸 놓는 것 같아.", axis: "loss" },
      { text: "떠난 뒤가 잘 안 보여.", axis: "uncertainty" },
      { text: "쉽게 떠나는 사람으로 보이기 싫어.", axis: "evaluation" },
    ],
    q4: [
      { q: "구체적으로 무엇이 아까운가요?", opts: ["들인 시간과 노력", "여기서 얻은 경험", "여기까지 온 과정 자체", "잘 모르겠다"] },
      { q: "무엇을 가장 놓치고 싶지 않나요?", opts: ["쌓아온 관계와 신뢰", "익힌 방식과 노하우", "지금의 위치나 안정감", "잘 모르겠다"] },
      { q: "무엇이 가장 안 보이나요?", opts: ["떠난 뒤 무엇을 할지", "새로운 자리에서 어떻게 될지", "다시 돌아올 수 있을지", "잘 모르겠다"] },
      { q: "어떤 모습으로 보이기 싫은가요?", opts: ["포기하는 사람", "끈기 없는 사람", "쉽게 자리를 떠나는 사람", "잘 모르겠다"] },
    ],
  },
  {
    id: 13,
    label: "애매한 상황에서\n하나만 정하는 것",
    plain: "애매한 상황에서 하나만 정하는 것",
    q3: [
      { text: "조금 더 두고 보면 어느 쪽이 맞는지 보일 것 같아.", axis: "uncertainty" },
      { text: "지금 정했다가 나중에 상황이 달라지면 곤란해.", axis: "uncertainty" },
      { text: "괜히 내가 먼저 정할 필요는 없을 것 같아.", axis: "responsibility" },
      { text: "내가 정했다가 잘못되면 결국 내 선택이 되는 거잖아.", axis: "responsibility" },
    ],
    q4: [
      { q: "무엇이 더 보이면 정할 수 있을 것 같나요?", opts: ["상황이 어느 쪽으로 가는지", "다른 사람들의 입장", "결과가 어떻게 될지", "잘 모르겠다"] },
      { q: "무엇이 분명해야 마음이 놓이나요?", opts: ["상황이 더 바뀌지 않는다는 것", "선택을 다시 바꿀 수 있다는 것", "지금 정해도 괜찮다는 것", "잘 모르겠다"] },
      { q: "지금 누가 정하는 것이 자연스럽다고 느끼나요?", opts: ["상대", "상황이 더 분명해질 때까지 기다리는 것", "함께 결정하는 것", "잘 모르겠다"] },
      { q: "무엇이 내 선택으로 남는 게 가장 부담되나요?", opts: ["결과", "다른 사람에게 미치는 영향", "내가 결정했다는 사실 자체", "잘 모르겠다"] },
    ],
  },
  {
    id: 14,
    label: "둘 중 하나를 고르며\n다른 하나를 포기하는 것",
    plain: "둘 중 하나를 고르며 다른 하나를 포기하는 것",
    q3: [
      { text: "하나를 고르면 다른 하나를 정말 놓아야 하잖아.", axis: "loss" },
      { text: "둘 다 나한테 아까운 선택이야.", axis: "loss" },
      { text: "지금 고르면 나중에 다른 쪽이 더 나았을 것 같아.", axis: "uncertainty" },
      { text: "아직은 하나를 포기할 만큼 확신이 없어.", axis: "uncertainty" },
    ],
    q4: [
      { q: "무엇만큼은 놓치고 싶지 않나요?", opts: ["다른 선택 자체", "그 선택이 줄 수 있는 기회", "나중에 다시 선택할 수 있는 여지", "잘 모르겠다"] },
      { q: "두 선택에서 각각 아깝게 느껴지는 것은 무엇인가요?", opts: ["얻을 수 있는 결과", "해보고 싶은 경험", "기대해 온 가능성", "잘 모르겠다"] },
      { q: "어떤 후회가 가장 걱정되나요?", opts: ["다른 쪽이 더 좋았을 거라는 후회", "너무 빨리 골랐다는 후회", "다시 선택하기 어렵다는 후회", "잘 모르겠다"] },
      { q: "무엇이 더 분명해야 하나를 놓을 수 있을 것 같나요?", opts: ["어느 쪽이 더 나은지", "내가 어느 쪽을 더 원하는지", "놓는 쪽을 포기해도 괜찮다는 것", "잘 모르겠다"] },
    ],
  },
];

const AXIS_LABEL = {
  evaluation: "타인의 평가",
  relationship: "관계가 달라짐",
  self_permission: "자기 허용",
  loss: "손실",
  uncertainty: "불확실성",
  responsibility: "책임",
};

const AXIS_MEANING = {
  evaluation: "다른 사람의 시선이나 평가가 행동을 정하기 전에 먼저 계산됩니다.",
  relationship: "그 행동을 하면 상대와의 사이가 달라질 거라는 예상이 판단보다 먼저 떠오릅니다.",
  self_permission: "그것을 해도 되는지를 남이 아니라 스스로에게 먼저 묻고 있습니다.",
  loss: "지금 가진 것, 쌓아온 것, 또는 다른 가능성을 잃는 계산이 다른 것보다 먼저 떠오릅니다.",
  uncertainty: "아직 확인되지 않은 결과나 반응에 대한 예상이 행동을 정할 때 먼저 끼어듭니다.",
  responsibility: "무엇이 내 몫인지, 결과나 부담을 어디까지 내가 가져야 하는지가 판단에 먼저 들어옵니다.",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Gowun+Batang:wght@400;700&display=swap');
.lc-root {
  --ground: #eae6da; --paper: #1c1a17; --ink: #1c1a17; --ink-soft: #847c6b;
  --muted: #847c6b; --open: #a13d2e; --line: rgba(49,53,45, 0.14);
  position: relative;
  flex: 1; min-height: 0;
  background: radial-gradient(120% 90% at 50% 0%, #f2eee0 0%, var(--ground) 62%);
  color: var(--paper); font-family: Pretendard, -apple-system, sans-serif;
  display: flex; flex-direction: column; align-items: center; padding: 28px 20px 40px; box-sizing: border-box;
}
.lc-shell { width: 100%; max-width: 420px; display: flex; flex-direction: column; flex: 1; }
.lc-eyebrow { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); text-align: center; margin-bottom: 4px; }
.lc-intro { display: flex; flex-direction: column; gap: 26px; text-align: center; padding-top: 56px; }
.lc-intro h1 { font-family: Pretendard, sans-serif; font-size: 26px; line-height: 1.3; margin: 0 0 18px; font-weight: 800; letter-spacing: -0.02em; }
.lc-intro p { color: var(--muted); font-weight: 300; font-size: 14px; line-height: 2; letter-spacing: 0.01em; margin: 0; }
.lc-progress { display: flex; justify-content: center; gap: 4px; margin-bottom: 26px; }
.lc-tick { width: 12px; height: 2px; background: var(--line); border-radius: 2px; }
.lc-tick.done { background: rgba(28,26,23, 0.7); }
.lc-tick.now { background: var(--open); }
.lc-stage { display: flex; align-items: center; justify-content: center; position: relative; min-height: 220px; margin-top: 24px; }
.lc-card {
  position: relative; width: 88%; max-width: 330px; min-height: 220px;
  background: #f5f2e6; overflow: hidden;
  color: var(--ink); border-radius: 2px; display: flex; align-items: center; justify-content: center;
  padding: 34px 26px; box-sizing: border-box; text-align: center;
  border: 1px solid rgba(28,26,23,0.14);
  box-shadow: 0 16px 32px rgba(0,0,0,0.22);
  transform: rotate(-1.2deg);
}
.lc-card-text { position: relative; font-family: Pretendard, sans-serif; font-size: 22px; line-height: 1.6; white-space: pre-line; font-weight: 500; letter-spacing: -0.01em; }
.lc-actions { display: flex; gap: 10px; margin-top: 18px; }
.lc-btn { flex: 1; padding: 16px 10px; border-radius: 2px; font-size: 15px; font-family: inherit; cursor: pointer; background: rgba(49,53,45,0.06); border: 1px solid var(--line); color: var(--paper); }
.lc-panel { flex: 1; display: flex; flex-direction: column; gap: 20px; padding-top: 8px; }
.lc-q { font-family: Pretendard, sans-serif; font-size: 19px; line-height: 1.62; margin: 0; font-weight: 400; }
.lc-subject { font-size: 12px; color: var(--open); border-left: 2px solid rgba(28,26,23,0.5); padding-left: 10px; margin: 0; }
.lc-opts { display: flex; flex-direction: column; gap: 8px; }
.lc-opt {
  text-align: left; padding: 15px 16px; border-radius: 2px; cursor: pointer;
  background: rgba(49,53,45,0.035); border: 1px solid var(--line);
  color: var(--paper); font-size: 14.5px; line-height: 1.6; font-family: inherit;
}
.lc-opt.sel { background: rgba(28,26,23,0.13); border-color: var(--open); color: #1c1a17; }
.lc-opt.last { color: var(--muted); }
.lc-next { width: 100%; padding: 16px; border-radius: 2px; margin-top: 4px; background: var(--open); border: none; color: #eae6da; font-weight: 600; font-size: 15px; font-family: inherit; cursor: pointer; }
.lc-next:disabled { background: rgba(49,53,45,0.07); color: var(--muted); cursor: default; }
.lc-count { display: flex; gap: 12px; margin: 4px 0 0; }
.lc-count-box { flex: 1; border: 1px solid var(--line); border-radius: 2px; padding: 18px 14px; }
.lc-count-box .n { font-family: Pretendard, sans-serif; font-size: 34px; line-height: 1; }
.lc-count-box .l { font-size: 11px; color: var(--muted); margin-top: 8px; letter-spacing: 0.06em; }
.lc-count-box.open .n { color: var(--open); }
.lc-opened { display: flex; flex-direction: column; gap: 8px; }
.lc-mini { padding: 15px 16px; border-radius: 2px; font-size: 14.5px; line-height: 1.5; background: #f5f2e6; border: 1px solid rgba(28,26,23,0.12); color: var(--ink); font-family: Pretendard, sans-serif; }
.lc-note { font-size: 13px; color: var(--muted); line-height: 1.8; margin: 0; }
.lc-cond { font-size: 12.5px; color: var(--ink-soft); margin-top: 8px; font-family: Pretendard, sans-serif; line-height: 1.6; }
.lc-tally { background: rgba(28,26,23,.1); border: 1px solid rgba(28,26,23,.35); border-radius: 3px; padding: 14px 16px; font-size: 13px; line-height: 1.7; }
.lc-tally b { color: var(--open); }
.lc-foot { text-align: center; margin-top: 26px; }
.lc-restart { background: none; border: none; color: var(--muted); font-size: 12px; cursor: pointer; text-decoration: underline; }
`;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Lectio({ onComplete }) {
  const { actions } = useUserState();
  const [screen, setScreen] = useState("intro");
  const [order, setOrder] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // itemId -> true(open)/false(closed)
  const [current, setCurrent] = useState(null);
  const [q3, setQ3] = useState(null);
  const [q4, setQ4] = useState(null);
  const [examined, setExamined] = useState({}); // itemId -> { q3Index, q4Index, condition }

  const start = () => {
    setOrder(shuffle(ITEMS));
    setIdx(0);
    setAnswers({});
    setExamined({});
    setScreen("q1");
  };

  const answer = (val) => {
    const item = order[idx];
    setAnswers((p) => ({ ...p, [item.id]: val }));
    if (idx + 1 < order.length) setIdx(idx + 1);
    else setScreen("summary");
  };

  const closed = useMemo(() => ITEMS.filter((it) => answers[it.id] === false), [answers]);
  const openCount = useMemo(() => ITEMS.filter((it) => answers[it.id] === true).length, [answers]);

  const pick = (item) => {
    setCurrent(item);
    setQ3(null);
    setQ4(null);
    setScreen("q3");
  };

  const chooseQ3 = (i) => {
    setQ3(i);
    setScreen("q4");
  };

  const finishItem = () => {
    setExamined((prev) => {
      const next = { ...prev, [current.id]: { q3Index: q3, q4Index: q4 } };
      const remaining = closed.filter((it) => next[it.id] === undefined);
      if (remaining.length > 0) {
        pick(remaining[0]);
      } else {
        setScreen("result");
      }
      return next;
    });
  };

  // --- 결과를 공통 User State(Lectio Object)로 변환해서 저장한다 ---
  const items = useMemo(() => {
    if (screen !== "result") return [];
    return ITEMS.map((it) => {
      const isOpen = answers[it.id] === true;
      if (isOpen) {
        return makeLectioItemResult({ itemId: it.id, label: it.plain, status: "open" });
      }
      const ex = examined[it.id];
      const closingLogicOpt = ex && ex.q3Index !== null ? it.q3[ex.q3Index] : null;
      const openingConditionOpt =
        ex && ex.q3Index !== null && ex.q4Index !== null && ex.q4Index !== it.q4[ex.q3Index].opts.length - 1
          ? it.q4[ex.q3Index].opts[ex.q4Index]
          : null;
      return makeLectioItemResult({
        itemId: it.id,
        label: it.plain,
        status: "closed",
        closingLogic: closingLogicOpt ? { text: closingLogicOpt.text, domain: closingLogicOpt.axis } : null,
        openingCondition: openingConditionOpt ?? null,
      });
    });
  }, [screen, answers, examined]);

  const tallyCounts = useMemo(() => {
    const c = {};
    items.forEach((it) => {
      if (it.closingLogic?.domain) c[it.closingLogic.domain] = (c[it.closingLogic.domain] ?? 0) + 1;
    });
    return c;
  }, [items]);

  const dominantDomain = useMemo(() => {
    let best = null;
    Object.entries(tallyCounts).forEach(([domain, n]) => {
      if (n >= 2 && (!best || n > best.n)) best = { domain, n };
    });
    return best;
  }, [tallyCounts]);

  useEffect(() => {
    if (screen !== "result") return;
    const raw = {};
    ITEMS.forEach((it) => {
      raw[it.id] = { status: answers[it.id] === true ? "open" : "closed", ...(examined[it.id] ?? {}) };
    });
    actions.completeLectio({ raw, items, dominantDomain });
    // 주의: 여기서 onComplete를 바로 호출해 다음 화면으로 넘기지 않는다 — 그러면 사용자가
    // 이 result 화면(자신이 다시 살펴본 항목)을 볼 새도 없이 Meditatio로 튕겨 나간다.
    // 다음 화면 이동은 아래 "Meditatio로 계속하기" 버튼을 사용자가 직접 눌렀을 때만 일어난다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <div className="lc-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <PaperGrain seed={3} opacity={0.14} />
      <div className="lc-shell">
        <SectionMark number="01" title="내가 할 수 있는 선택" />

        {screen === "intro" && (
          <>
            <div className="lc-intro">
              <p>
                지금 그 상황이 실제로 생긴다면
                <br />
                어떤 행동을 할 수 있는지 골라 주세요.
              </p>
            </div>
            <button className="lc-next" style={{ marginTop: 24 }} onClick={start}>시작하기</button>
          </>
        )}

        {screen === "q1" && order.length > 0 && (
          <>
            <div className="lc-progress">
              {order.map((_, i) => (
                <div key={i} className={`lc-tick ${i < idx ? "done" : ""} ${i === idx ? "now" : ""}`} />
              ))}
            </div>
            <div className="lc-stage">
              <div className="lc-card">
                <PaperGrain seed={7} baseFrequency={0.9} octaves={2} opacity={0.1} />
                <span className="lc-card-text">{order[idx].label}</span>
              </div>
            </div>
            <div className="lc-actions">
              <button className="lc-btn" onClick={() => answer(false)}>어렵다</button>
              <button className="lc-btn" onClick={() => answer(true)}>할 수 있다</button>
            </div>
          </>
        )}

        {screen === "summary" && (
          <div className="lc-panel">
            <p className="lc-q">{order.length}장을 모두 보셨습니다.</p>
            <div className="lc-count">
              <div className="lc-count-box open"><div className="n">{openCount}</div><div className="l">할 수 있다</div></div>
              <div className="lc-count-box"><div className="n">{closed.length}</div><div className="l">어렵다</div></div>
            </div>
            <p className="lc-note">
              {closed.length > 0 ? "어렵다고 답한 것을 하나씩 살펴보겠습니다." : "어렵다고 넘긴 것이 없습니다."}
            </p>
            <button className="lc-next" onClick={() => (closed.length ? pick(closed[0]) : setScreen("result"))}>계속</button>
          </div>
        )}

        {screen === "q3" && current && (
          <div className="lc-panel">
            <p className="lc-subject">{current.plain}</p>
            <p className="lc-q">그것을 하기 어렵다고 생각하는 주된 이유는 무엇입니까?</p>
            <div className="lc-opts">
              {current.q3.map((c, i) => (
                <button key={i} className={`lc-opt ${q3 === i ? "sel" : ""}`} onClick={() => chooseQ3(i)}>{c.text}</button>
              ))}
              <button className="lc-opt last" onClick={finishItem}>딱 맞는 생각이 없다</button>
            </div>
          </div>
        )}

        {screen === "q4" && current && q3 !== null && (
          <div className="lc-panel">
            <p className="lc-subject">{current.plain}</p>
            <p className="lc-q">{current.q4[q3].q}</p>
            <div className="lc-opts">
              {current.q4[q3].opts.map((o, i) => (
                <button
                  key={i}
                  className={`lc-opt ${q4 === i ? "sel" : ""} ${i === current.q4[q3].opts.length - 1 ? "last" : ""}`}
                  onClick={() => setQ4(i)}
                >
                  {o}
                </button>
              ))}
            </div>
            <button className="lc-next" disabled={q4 === null} onClick={finishItem}>다음</button>
          </div>
        )}

        {screen === "result" && (
          <div className="lc-panel">
            <p className="lc-q">오늘 {Object.keys(examined).length}개를 다시 살펴보셨습니다.</p>
            <p className="lc-note">살펴본 것</p>
            <div className="lc-opened">
              {items.filter((it) => it.status === "closed").map((it) => (
                <div key={it.itemId} className="lc-mini">
                  {it.label}
                  {it.closingLogic && <div className="lc-cond">— {it.closingLogic.text}</div>}
                  {it.openingCondition && <div className="lc-cond">이럴 때는: {it.openingCondition}</div>}
                </div>
              ))}
            </div>

            {dominantDomain && (
              <div className="lc-tally">
                <b>{AXIS_LABEL[dominantDomain.domain]}</b> — {dominantDomain.n}번
                <br />
                {AXIS_MEANING[dominantDomain.domain]}
              </div>
            )}

            {onComplete && (
              <button className="lc-next" onClick={() => onComplete({ items, dominantDomain })}>
                Meditatio로 계속하기
              </button>
            )}
            <div className="lc-foot">
              <button className="lc-restart" onClick={() => setScreen("intro")}>처음부터 다시</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

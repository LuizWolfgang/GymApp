export const formataCpf = (cpf: string): string => {
  // TODO função antiga veriificar se não deu bug apos testes
  // if (cpf.length < 11) {
  //   return cpf;
  // }
  // const first = cpf.substr(0, 3);
  // const second = cpf.substr(4, 3);
  // const third = cpf.substr(6, 3);
  // const digit = cpf.substr(9);
  // return `${first}.${second}.${third}-${digit}`;
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
};

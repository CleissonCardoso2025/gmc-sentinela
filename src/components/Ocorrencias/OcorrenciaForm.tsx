const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!local || !descricao) {
    toast.error('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  try {
    setIsLoading(true);

    const uploadedAttachments = [];

    if (attachments.length > 0) {
      for (const attachment of attachments) {
        if (attachment.file) {
          const fileExt = attachment.file.name.split('.').pop();
          const filePath = `${numero}/${attachment.id}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ocorrencia-attachments')
            .upload(filePath, attachment.file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            toast.error(`Erro ao enviar anexo: ${attachment.file.name}`);
            continue;
          }

          uploadedAttachments.push({
            path: filePath,
            type: attachment.type,
            description: attachment.description
          });
        }
      }
    }

    const ocorrenciaData = {
      numero,
      tipo,
      status,
      data: new Date(`${data}T${hora}:00`).toISOString(), // ✅ Corrigido aqui
      local,
      descricao,
      latitude: position?.lat,
      longitude: position?.lng,
      providencias: providencias.filter(p => p.checked).map(p => p.label),
      envolvidos,
      agentes_envolvidos: selectedAgents,
      attachments: uploadedAttachments,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('ocorrencias')
      .insert(ocorrenciaData);

    if (error) throw error;

    toast.success('Ocorrência registrada com sucesso!');

    // reset
    setTipo('Trânsito');
    setStatus('Aberta');
    setLocal('');
    setDescricao('');
    setPosition(null);
    setEnvolvidos([]);
    setProvidencias(providencias.map(p => ({ ...p, checked: false })));
    setSelectedAgents([]);
    setAttachments([]);

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setNumero(`BO-${year}${month}${day}-${randomDigits}`);

  } catch (error) {
    console.error('Error saving occurrence:', error);
    toast.error('Erro ao registrar ocorrência. Tente novamente.');
  } finally {
    setIsLoading(false);
  }
};

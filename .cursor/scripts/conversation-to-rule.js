class ConversationToRuleConverter {

    async captureSuccessfulConversation(conversationId) {
      const conversation = await this.getConversation(conversationId);
  
      // Análisis automático de patrones
      const patterns = this.extractPatterns(conversation);
      const codeExamples = this.extractCodeExamples(conversation);
      const guidelines = this.extractGuidelines(conversation);
  
      return {
        patterns,
        codeExamples,
        guidelines,
        metadata: {
          conversationId,
          timestamp: new Date(),
          participants: conversation.participants,
          tags: this.generateTags(conversation)
        }
      };
    }
  
    generateRule(conversationData, ruleType = 'pattern') {
      const template = this.getRuleTemplate(ruleType);
  
      return {
        filename: this.generateFilename(conversationData),
        content: this.populateTemplate(template, conversationData),
        category: this.determineCategory(conversationData),
        priority: this.calculatePriority(conversationData)
      };
    }
  
    extractPatterns(conversation) {
      const patterns = [];
  
      // Buscar patrones de código exitosos
      const successfulCodeBlocks = conversation.messages
        .filter(msg => msg.type === 'code' && msg.feedback === 'positive')
        .map(msg => ({
          code: msg.content,
          context: msg.context,
          explanation: msg.explanation
        }));
  
      // Identificar patrones comunes
      for (const block of successfulCodeBlocks) {
        const pattern = this.identifyPattern(block);
        if (pattern && !patterns.some(p => p.signature === pattern.signature)) {
          patterns.push(pattern);
        }
      }
  
      return patterns;
    }
  
    generateFilename(conversationData) {
      const { tags, timestamp } = conversationData.metadata;
      const mainTag = tags[0] || 'general';
      const dateStr = timestamp.toISOString().split('T')[0];
  
      return `${mainTag}-pattern-${dateStr}.md`;
    }
  }
  
  // Usage example
  const converter = new ConversationToRuleConverter();
  
  // Capturar conversación exitosa sobre optimización de componentes React
  const conversationData = await converter.captureSuccessfulConversation('conv-123');
  
  // Generar regla automáticamente
  const rule = converter.generateRule(conversationData, 'performance-pattern');
  
  // Aplicar a proyecto
  await applyRuleToProject(rule);